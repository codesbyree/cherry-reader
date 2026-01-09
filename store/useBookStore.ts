import { create } from "zustand";

import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { desc } from "drizzle-orm";

type Store = {
  isLoading: boolean;
  books: schema.Book[];
  recentlyReadBooks: schema.Book[];
  hydrate: () => Promise<void>;
};

export const useBookStore = create<Store>((set, get) => ({
  isLoading: false,
  books: [],
  recentlyReadBooks: [],
  hydrate: async () => {
    set({ isLoading: true });

    try {
      const books = await db.select().from(schema.books);
      const recentlyReadBooks = await db
        .select()
        .from(schema.books)
        .orderBy(desc(schema.books.updated_at))
        .limit(5);

      set({ books, recentlyReadBooks });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
