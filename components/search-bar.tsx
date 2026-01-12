import { useSearchStore } from "@/store/useSearchStore";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, BrushCleaningIcon, XIcon } from "lucide-react-native";
import { TextInput, View } from "react-native";

import { cn } from "@/lib/utils";
import Button from "./ui/button";

export default function SearchBar() {
  const router = useRouter();
  const { searchQuery, updateSearchQuery, clearSearchHistory } =
    useSearchStore();

  return (
    <View className="px-6 pl-[14px] h-16 bg-white justify-between items-center flex-row border-b border-slate-200">
      <View className="flex-row items-center flex-1">
        <Button style="border-transparent" onPress={() => router.back()}>
          <ArrowLeftIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
        </Button>

        <TextInput
          className="flex-1 text-slate-900 text-base font-outfit"
          onChangeText={(t) => updateSearchQuery(t)}
          placeholder="Search books"
          placeholderTextColor={"rgba(0,0,0,.6)"}
          value={searchQuery}
          onSubmitEditing={() => {
            useSearchStore.setState({ isLoading: true });
            router.push("/search/search-result");
          }}
        />
      </View>

      <View className="flex-row items-center gap-2">
        <Button
          style={cn(
            "border-transparent",
            searchQuery.length ? "opacity-100" : "opacity-0 pointer-none"
          )}
          onPress={() => updateSearchQuery("")}
        >
          <XIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
        </Button>

        <Button style="border-transparent" onPress={() => clearSearchHistory()}>
          <BrushCleaningIcon size={20} strokeWidth={1.5} color={"#E92F51"} />
        </Button>
      </View>
    </View>
  );
}
