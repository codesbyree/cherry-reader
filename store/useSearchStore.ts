import { db } from "@/db/client";
import * as schema from "@/db/schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sql } from "drizzle-orm";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

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

export const useSearchStore = create<Store>()(
  persist(
    (set, get) => ({
      isLoading: false,
      searchQuery: "",
      searchResult: {},
      searchQueries: {},
      updateSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      searchBookByTitle: async (query: string) => {
        try {
          const formattedQuery = query.trim();

          const isQueryValid = Boolean(formattedQuery.length);
          const isQueryAlreadyExist =
            get().searchResult.hasOwnProperty(formattedQuery);

          if (!isQueryValid || isQueryAlreadyExist) return;

          const result = await db
            .select()
            .from(schema.books)
            .where(
              sql`${schema.books.title} LIKE ${"%" + formattedQuery + "%"}`
            );

          set((state) => ({
            isLoading: false,
            searchQueries: {
              ...state.searchQueries,
              [query]: query,
            },
            searchResult: {
              ...state.searchResult,
              [query]: result,
            },
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
    }),
    {
      name: "search-history-storage",
      storage: createJSONStorage(() => AsyncStorage as StateStorage),
      partialize: (state) => ({
        searchQueries: state.searchQueries,
      }),
    }
  )
);
