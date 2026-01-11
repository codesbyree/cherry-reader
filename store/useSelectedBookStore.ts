import * as schema from "@/db/schema";
import { create } from "zustand";
import { useBookStore } from "./useBookStore";

type Store = {
  isSelectingBooks: boolean;
  selectedBooks: Record<number, schema.Book>;
  selectedBooksLength: number;
  isAllBooksSelected: boolean;
  addToSelectedBooks: (book: schema.Book) => void;
  removeFromSelectedBooks: (bookId: number) => void;
  clearSelectedBooksList: () => void;
  selectAllBooks: () => void;
  stopSelectingBooks: () => void;
};

export const useSelectedBookStore = create<Store>((set, get) => ({
  isSelectingBooks: false,
  selectedBooks: {},
  selectedBooksLength: 0,
  isAllBooksSelected: false,
  addToSelectedBooks: (book) => {
    const books = useBookStore.getState().books;

    set((state) => ({
      selectedBooks: {
        ...state.selectedBooks,
        [book.id!]: book,
      },
      isSelectingBooks: true,
      selectedBooksLength: state.selectedBooksLength + 1,
      isAllBooksSelected: state.selectedBooksLength + 1 === books.length,
    }));
  },
  selectAllBooks: () => {
    const currentState = get().selectedBooks;
    const books = useBookStore.getState().books;

    for (const book of books) {
      currentState[Number(book.id)] = book;
    }

    set((state) => ({
      isSelectingBooks: true,
      selectedBooks: { ...currentState },
      selectedBooksLength: books.length,
      isAllBooksSelected: true,
    }));
  },
  removeFromSelectedBooks: (bookId) => {
    set((state) => {
      const newState = { ...state.selectedBooks };
      delete newState[bookId];
      return {
        selectedBooks: newState,
        selectedBooksLength: state.selectedBooksLength - 1,
        isAllBooksSelected: false,
        isSelectingBooks: !(state.selectedBooksLength - 1 === 0),
      };
    });
  },
  clearSelectedBooksList: () => {
    set(() => ({
      selectedBooks: {},
      selectedBooksLength: 0,
      isAllBooksSelected: false,
    }));
  },
  stopSelectingBooks: () => {
    set({ isSelectingBooks: false });
  },
}));
