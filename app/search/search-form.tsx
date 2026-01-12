import { useSearchStore } from "@/store/useSearchStore";
import { useRouter } from "expo-router";
import { ArrowUpLeftIcon, SearchIcon } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import Button from "@/components/ui/button";

export default function SearchFormScreen() {
  const router = useRouter();
  const { searchQueries, updateSearchQuery } = useSearchStore();

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
      {Object.keys(searchQueries).map((q) => (
        <View
          key={q}
          className="w-full h-14 flex-row justify-between items-center px-6"
        >
          <Button
            style="border-transparent flex-1 justify-start"
            contentStyle="flex-row gap-4 justify-start"
            onPress={() => {
              updateSearchQuery(q.trim());
              router.push("/search/search-result");
            }}
          >
            <View className="rounded-[1000] w-10 h-10 bg-pink-100 items-center justify-center justf">
              <SearchIcon size={20} strokeWidth={1.5} color={"#E92F51"} />
            </View>

            <Text className="font-outfit text-base text-slate-900">{q}</Text>
          </Button>

          <Button
            style="border-transparent"
            buttonSize="icon"
            onPress={() => updateSearchQuery(q)}
          >
            <ArrowUpLeftIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
          </Button>
        </View>
      ))}
    </ScrollView>
  );
}
