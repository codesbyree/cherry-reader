import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { DOMParser } from "@xmldom/xmldom";
import { Buffer } from "buffer";
import { inArray } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
import { unzipSync } from "fflate";
import moment from "moment";
import { create } from "zustand";
import { useBookStore } from "./useBookStore";

type Store = {
  isLoading: boolean;
  directory?: string;
  selectLocaleDirectory: () => Promise<void>;
  syncLibrary: () => Promise<void>;
  newFiles: number;
  newFilesSynced: number;
};

const getEpubMetadata = async (fileUri: string) => {
  try {
    const b64 = new FileSystem.File(fileUri).base64();
    const base64 = await b64;

    const uint8Array = new Uint8Array(Buffer.from(base64, "base64"));
    const decompressed = unzipSync(uint8Array);

    const containerXml = decompressed["META-INF/container.xml"];
    if (!containerXml) throw new Error("Invalid EPUB: Missing container.xml");

    const containerStr = new TextDecoder().decode(containerXml);
    const containerDoc = new DOMParser().parseFromString(
      containerStr,
      "text/xml"
    );
    const opfPath = containerDoc
      .getElementsByTagName("rootfile")[0]
      ?.getAttribute("full-path");

    if (!opfPath) throw new Error("Invalid EPUB: Missing OPF path");

    const opfStr = new TextDecoder().decode(decompressed[opfPath]);
    const opfDoc = new DOMParser().parseFromString(opfStr, "text/xml");

    // Get Title and Author
    const title =
      opfDoc.getElementsByTagName("dc:title")[0]?.textContent ||
      "Unknown Title";
    const author =
      opfDoc.getElementsByTagName("dc:creator")[0]?.textContent ||
      "Unknown Author";

    // --- Cover Image Logic ---
    let coverBase64 = "";
    try {
      const metadata = opfDoc.getElementsByTagName("metadata")[0];
      const manifest = opfDoc.getElementsByTagName("manifest")[0];

      // 1. Find the cover ID from metadata
      const metaTags = Array.from(metadata.getElementsByTagName("meta"));
      const coverMeta = metaTags.find(
        (m) => m.getAttribute("name") === "cover"
      );
      const coverId = coverMeta?.getAttribute("content");

      if (coverId) {
        // 2. Find the item in manifest matching the ID
        const items = Array.from(manifest.getElementsByTagName("item"));
        const coverItem = items.find((i) => i.getAttribute("id") === coverId);
        const coverHref = coverItem?.getAttribute("href");

        if (coverHref) {
          // 3. Resolve path relative to the OPF file location
          const opfDir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
          const fullCoverPath = opfDir + coverHref;

          const coverData = decompressed[fullCoverPath];
          if (coverData) {
            coverBase64 = `data:${
              coverItem?.getAttribute("media-type") || "image/jpeg"
            };base64,${Buffer.from(coverData).toString("base64")}`;
          }
        }
      }
    } catch (e) {
      console.log("Cover extraction failed", e);
    }

    return { title, author, cover: coverBase64 };
  } catch (error) {
    console.error("Metadata extraction failed:", error);
    return { title: "Unknown Title", author: "Unknown Author", cover: "" };
  }
};

export const useLibraryStore = create<Store>((set, get) => ({
  isLoading: false,
  directory: undefined,
  newFiles: 0,
  newFilesSynced: 0,
  selectLocaleDirectory: async () => {
    if (!get().directory) {
      const directory = await FileSystem.Directory.pickDirectoryAsync();
      if (directory) {
        set({ directory: directory.uri });
      }
    }
  },
  syncLibrary: async () => {
    set({ isLoading: true });

    try {
      if (!get().directory) return;

      const directory = new FileSystem.Directory(get().directory as string);
      const epubFiles = await directory.list();

      const filteredEpubs = epubFiles.filter((f) =>
        f.uri.toLowerCase().includes(".epub")
      );
      const newUris = filteredEpubs.map((f) => f.uri);

      const existingBooks = await db.select().from(schema.books);
      const existingUris = existingBooks.map((b) => b.path);

      const newFiles = filteredEpubs.filter(
        (epub) => !existingUris.includes(epub.uri)
      );

      set({ newFiles: newFiles.length });

      const deletedUris = existingUris.filter(
        (epub) => !newUris.includes(epub)
      );

      if (deletedUris.length > 0) {
        await db
          .delete(schema.books)
          .where(inArray(schema.books.path, deletedUris));
      }

      for (const file of newFiles) {
        const metadata = await getEpubMetadata(file.info().uri as string);
        set({ newFilesSynced: get().newFilesSynced + 1 });

        await db
          .insert(schema.books)
          .values({
            title: metadata.title as string,
            author: metadata.author as string,
            path: file.info().uri as string,
            image: metadata.cover as string,
            created_at: moment(new Date()).format("YYYY-MM-DD"),
            updated_at: moment(new Date()).format("YYYY-MM-DD"),
          })
          .onConflictDoNothing();

        await useBookStore.getState().hydrate();
      }
    } catch (error: any) {
      console.error("Sync Error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
