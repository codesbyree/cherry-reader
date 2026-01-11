import { ScrollView, Text } from "react-native";

import { cn } from "@/lib/utils";
import { useSelectedBookStore } from "@/store/useSelectedBookStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SearchIcon } from "lucide-react-native";

import BooksList from "@/components/books-list";
import ContinueReadingList from "@/components/continue-reading-list";
import Button from "@/components/ui/button";

export default function HomeScreen() {
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex bg-white"
      >
        <ContinueReadingList />
        <BooksList />
      </ScrollView>

      <SearchButton />

      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0)", "rgba(255,255,255,.9)"]}
        className="h-[128] absolute bottom-0 left-0 w-full z-30 pointer-events-none"
      />
    </>
  );
}

function SearchButton() {
  const router = useRouter();
  const { isSelectingBooks } = useSelectedBookStore();

  return (
    <Button
      style={cn(
        "rounded-full bg-pink-900 border-transparent h-10 w-[110px] absolute bottom-10 z-50 self-center",
        isSelectingBooks ? "hidden" : "flex"
      )}
      contentStyle="flex-row items-center"
      onPress={() => router.push("/search")}
    >
      <SearchIcon size={24} color={"#FFF"} strokeWidth={1.5} />
      <Text className="font-outfit text-base color-white">Search</Text>
    </Button>
  );
}
