import { ArrowDownAZIcon, ArrowUpAZIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { useBookStore } from "@/store/useBookStore";

import BookCard from "./ui/book-card";
import ToggleButton from "./ui/toggle-button";

export default function BooksList() {
  const [sorter, setSorter] = useState<SortingBehaviourTypes>("asc");
  const [filter, setFilter] = useState("");

  const { books } = useBookStore();

  const sortBooks = (sorter: SortingBehaviourTypes) => {
    if (sorter === "asc") return books;
    return [...books].sort((a, b) => b.title.localeCompare(a.title));
  };
  const sortedBooks = sortBooks(sorter);

  const toggleSorter = () => {
    if (sorter === "asc") setSorter("desc");
    else setSorter("asc");
  };

  return (
    <View className="py-4 bg-white gap-3">
      <View className="flex-row justify-between items-center px-6 pr-[14px]">
        <Text className="font-outfit text-lg text-slate-900">My Shelf</Text>

        <ToggleButton
          state={sorter === "asc"}
          onPress={toggleSorter}
          style="border-transparent"
        >
          <ArrowDownAZIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
          <ArrowUpAZIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
        </ToggleButton>
      </View>

      <View className="flex-row flex-wrap px-6 gap-2">
        {sortedBooks.map((book) => (
          <BookCard {...book} key={book.id} />
        ))}
      </View>
    </View>
  );
}
