import { useBookStore } from "@/store/useBookStore";
import { ScrollView, Text, View } from "react-native";

import BookCard from "./ui/book-card";
import Button from "./ui/button";

const categories = [
  "All",
  "Science Fiction",
  "Dystopian",
  "Fiction",
  "Young Adults",
];

export default function BooksList() {
  const { books } = useBookStore();

  return (
    <View className="py-4 bg-white gap-3">
      <Text className="font-outfit text-lg ml-6 text-slate-900">My Shelf</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-6 gap-[10px] flex-row">
          {categories.map((c) => (
            <Button key={c} style="px-3 bg-pink-50 h-[30px]">
              <Text className="font-outfit text-slate-600">{c}</Text>
            </Button>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row flex-wrap justify-center gap-2">
        {books.map((book) => (
          <BookCard {...book} key={book.id} />
        ))}
      </View>
    </View>
  );
}
