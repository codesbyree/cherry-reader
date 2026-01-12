import { ScrollView } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import BooksList from "@/components/books-list";
import ContinueReadingList from "@/components/continue-reading-list";
import FloatingButton from "@/components/ui/floating-button";

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

      <FloatingButton />

      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0)", "rgba(255,255,255,.9)"]}
        className="h-[128] absolute bottom-0 left-0 w-full z-30 pointer-events-none"
      />
    </>
  );
}
