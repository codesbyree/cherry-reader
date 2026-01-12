import { useSearchStore } from "@/store/useSearchStore";
import { LoaderIcon } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";

import BookCard from "@/components/ui/book-card";

export default function SearchResult() {
  const { getSearchHistory, searchQuery, searchBookByTitle, isLoading } =
    useSearchStore();
  const searchData = getSearchHistory(searchQuery);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleSearch = (text: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        searchBookByTitle(text);
      }, 800);
    };

    handleSearch(searchQuery);
  }, [searchBookByTitle, searchQuery]);

  const contentRenderer = () => {
    if (isLoading && !searchData.length)
      return (
        <View className="flex-1 items-center justify-center bg-white">
          <View className="animate-spin duration-1000 repeat-infinite">
            <LoaderIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
          </View>
        </View>
      );

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-white flex-1"
      >
        <Text className="font-outfit mx-6 mt-4 mb-2 text-slate-600">
          Found {searchData.length} item{searchData.length > 1 ? "s" : ""}
        </Text>

        <View className="flex-row flex-wrap gap-2 px-6">
          {searchData.map((book) => (
            <BookCard {...book} key={book.id} />
          ))}
        </View>
      </ScrollView>
    );
  };

  return <>{contentRenderer()}</>;
}
