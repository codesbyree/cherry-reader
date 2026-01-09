import { useBookStore } from "@/store/useBookStore";
import { ScrollView, Text, View } from "react-native";
import ContinueReadCard from "./ui/continue-read-card";

export default function ContinueReadingList() {
  const { recentlyReadBooks } = useBookStore();

  if (recentlyReadBooks.length)
    return (
      <View className="py-4 bg-pink-100 gap-3">
        <Text className="font-outfit text-lg ml-6 text-slate-900">
          Continue Reading
        </Text>

        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View className="flex-row gap-2 px-6">
            {recentlyReadBooks.map((book) => (
              <ContinueReadCard {...book} key={book.id} />
            ))}
          </View>
        </ScrollView>
      </View>
    );

  return <></>;
}
