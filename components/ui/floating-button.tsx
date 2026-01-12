import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import { Text } from "react-native";

import { useSelectedBookStore } from "@/store/useSelectedBookStore";

import Button from "./button";

export default function FloatingButton() {
  const router = useRouter();
  const { isSelectingBooks } = useSelectedBookStore();

  return (
    <Button
      style={cn(
        "rounded-full bg-pink-900 border-transparent h-10 w-[110px] absolute bottom-10 z-50 self-center",
        isSelectingBooks ? "hidden" : "flex"
      )}
      contentStyle="flex-row items-center"
      onPress={() => router.push("/search/search-form")}
    >
      <SearchIcon size={24} color={"#FFF"} strokeWidth={1.5} />
      <Text className="font-outfit text-base color-white">Search</Text>
    </Button>
  );
}
