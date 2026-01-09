import { useBookStore } from "@/store/useBookStore";
import { Text, View } from "react-native";
import BookCard from "./ui/book-card";

export default function BooksList() {
  const { books } = useBookStore();

  return (
    <View className="py-4 bg-white gap-3">
      <Text className="font-outfit text-lg ml-6 text-slate-900">My Shelf</Text>

      <View className="flex-row flex-wrap justify-center gap-2">
        {books.map((book) => (
          <BookCard {...book} key={book.id} />
        ))}
      </View>
    </View>
  );
}
