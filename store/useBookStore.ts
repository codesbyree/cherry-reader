import { create } from "zustand";

import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import moment from "moment";
import { useSelectedBookStore } from "./useSelectedBookStore";

type Store = {
  isLoading: boolean;
  books: schema.Book[];
  recentlyReadBooks: schema.Book[];
  hydrate: () => Promise<void>;
  addBookToRecentyRead: (bookId: number) => Promise<void>;
  deleteAllBooks: () => Promise<void>;
  deleteSelectedBooks: () => Promise<void>;
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
        .where(eq(schema.books.opened, 1))
        .limit(5);

      set({ books, recentlyReadBooks });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  addBookToRecentyRead: async (bookId: number) => {
    const prevState = get().recentlyReadBooks;

    try {
      const newState = prevState.filter((b) => b.id !== bookId);

      const book = await db
        .select()
        .from(schema.books)
        .where(eq(schema.books.id, bookId));

      set({ recentlyReadBooks: [book[0], ...newState] });

      await db
        .update(schema.books)
        .set({ opened: 1, updated_at: moment().format() })
        .where(eq(schema.books.id, bookId));
    } catch (error: any) {
      console.log(error.message);
      set({ recentlyReadBooks: prevState });
    }
  },
  deleteAllBooks: async () => {
    const prevBookState = get().books;
    const prevRecentlyReadBookState = get().recentlyReadBooks;

    try {
      set({ books: [], recentlyReadBooks: [] });

      await db.delete(schema.books);
    } catch (error: any) {
      console.log(error.message);
      set({
        books: prevBookState,
        recentlyReadBooks: prevRecentlyReadBookState,
      });
    }
  },
  deleteSelectedBooks: async () => {
    const prevBookState = get().books;
    const prevRecentlyReadBookState = get().recentlyReadBooks;

    try {
      const selectedBooks = useSelectedBookStore.getState().selectedBooks;
      const selectedBooksId = Object.values(selectedBooks).map((x) =>
        Number(x.id)
      );

      set({ books: [], recentlyReadBooks: [], isLoading: true });

      await db
        .delete(schema.books)
        .where(inArray(schema.books.id, selectedBooksId));

      useSelectedBookStore.getState().clearSelectedBooksList();
      useSelectedBookStore.getState().stopSelectingBooks();
    } catch (error: any) {
      console.log(error.message);
      set({
        books: prevBookState,
        recentlyReadBooks: prevRecentlyReadBookState,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
