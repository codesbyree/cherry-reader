import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { DOMParser } from "@xmldom/xmldom";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { unzipSync } from "fflate";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { inArray } from "drizzle-orm";
import { useBookStore } from "./useBookStore";

type Store = {
  isLoading: boolean;
  isSyncing: boolean;
  directory?: string;
  selectLocaleDirectory: () => Promise<void>;
  syncLibrary: () => Promise<void>;
  newFilesCount: number;
  newFilesSyncedCount: number;
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

export const useLibraryStore = create<Store>()(
  persist(
    (set, get) => ({
      isLoading: false,
      directory: undefined,
      isSyncing: false,
      newFilesCount: 0,
      newFilesSyncedCount: 0,
      selectLocaleDirectory: async () => {
        if (!get().directory) {
          const directory = await FileSystem.Directory.pickDirectoryAsync();
          if (directory) {
            set({ directory: directory.uri });
          }
        }
      },
      syncLibrary: async () => {
        set({ isSyncing: true });

        try {
          if (!get().directory) return;

          const directory = new FileSystem.Directory(get().directory as string);
          const epubFiles = await directory.list();

          const booksInDirectory = epubFiles.filter((f) =>
            f.uri.toLowerCase().includes(".epub")
          );
          const normalizedBookUris = booksInDirectory.map((x) =>
            x.uri.replace(/\/$/, "").toLowerCase()
          );

          const existingBooks = await db
            .select({ path: schema.books.path })
            .from(schema.books);
          const existingBooksUris = existingBooks.map((b) =>
            b.path.replace(/\/$/, "").toLowerCase()
          );

          const unsavedBooks = booksInDirectory.filter(
            (x) =>
              !existingBooksUris.includes(
                x.uri.replace(/\/$/, "").toLowerCase()
              )
          );
          const deletedBooks = existingBooksUris.filter(
            (x) => !normalizedBookUris.includes(x)
          );

          set({ newFilesCount: unsavedBooks.length });

          if (deletedBooks.length > 0) {
            await db
              .delete(schema.books)
              .where(inArray(schema.books.path, deletedBooks));
          }

          if (unsavedBooks.length) {
            for (const file of unsavedBooks) {
              const metadata = await getEpubMetadata(file.info().uri as string);
              set({ newFilesSyncedCount: get().newFilesSyncedCount + 1 });

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
            }

            await useBookStore.getState().hydrate();
          }
        } catch (error: any) {
          console.error("Sync Error:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "library-storage",
      storage: createJSONStorage(() => AsyncStorage as StateStorage),
      partialize: (state) => ({ directory: state.directory }),
    }
  )
);
