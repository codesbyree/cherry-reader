import { ScrollView } from "react-native";

import BooksList from "@/components/books-list";
import ContinueReadingList from "@/components/continue-reading-list";

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex bg-white">
      <ContinueReadingList />
      <BooksList />
    </ScrollView>
  );
}
