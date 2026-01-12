import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";
import { create } from "zustand";

type Store = {
  isLoading: boolean;
  searchQuery: string;
  searchResult: Record<string, schema.Book[]>;
  searchQueries: Record<string, string>;
  searchBookByTitle: (query: string) => Promise<void>;
  updateSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;
  getSearchHistory: (query: string) => schema.Book[];
};

export const useSearchStore = create<Store>((set, get) => ({
  isLoading: false,
  searchQuery: "",
  searchResult: {},
  searchQueries: {},
  updateSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  searchBookByTitle: async (query: string) => {
    set({ isLoading: true });

    try {
      if (!query.trim().length) return;

      const formattedQuery = query.trim();
      const searchResult = get().searchResult;
      const prevSearchQueries = get().searchQueries;
      if (!searchResult.hasOwnProperty(formattedQuery)) {
        const result = await db
          .select()
          .from(schema.books)
          .where(sql`${schema.books.title} LIKE ${"%" + formattedQuery + "%"}`);

        searchResult[query] = result;
        prevSearchQueries[query] = query;
      }

      set((state) => ({
        isLoading: false,
        searchQueries: { ...state.searchQueries, ...prevSearchQueries },
        searchResult: { ...state.searchResult, ...searchResult },
      }));
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  clearSearchHistory: () => {
    set((state) => ({ searchResult: {}, searchQueries: {} }));
  },
  getSearchHistory: (query: string) => {
    return get().searchResult[query.trim()] || [];
  },
}));
