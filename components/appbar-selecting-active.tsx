import {
  SquareCheckIcon,
  SquareIcon,
  TagsIcon,
  XIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";
import Button from "./ui/button";

import { useSelectedBookStore } from "@/store/useSelectedBookStore";

import DeleteSelectedBookButton from "./delete-selected-book-button";
import ToggleButton from "./ui/toggle-button";

export default function AppBarBookSelectingActive() {
  const {
    selectedBooksLength,
    clearSelectedBooksList,
    selectAllBooks,
    isAllBooksSelected,
    stopSelectingBooks,
  } = useSelectedBookStore();

  const closeBooksSelection = () => {
    clearSelectedBooksList();
    stopSelectingBooks();
  };

  const toggleSelectUnSelectAll = () => {
    if (isAllBooksSelected) return clearSelectedBooksList();
    selectAllBooks();
  };

  return (
    <View className="flex-1 justify-between items-center flex-row">
      <View className="flex-row gap-4">
        <Button
          onPress={closeBooksSelection}
          style="border-transparent"
          contentStyle="flex-row"
        >
          <XIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
          <Text className="font-outfit text-base text-slate-900">
            {selectedBooksLength}
          </Text>
        </Button>

        <ToggleButton
          state={isAllBooksSelected}
          onPress={toggleSelectUnSelectAll}
          style="border-transparent"
        >
          <View className="flex-row gap-2 items-center">
            <SquareIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
            <Text className="font-outfit text-base text-slate-900">
              Select All
            </Text>
          </View>

          <View className="flex-row gap-2 items-center">
            <SquareCheckIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
            <Text className="font-outfit text-base text-slate-900">
              Unselect All
            </Text>
          </View>
        </ToggleButton>
      </View>

      <View className="flex-row gap-2">
        <Button style="border-transparent">
          <TagsIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
        </Button>

        <DeleteSelectedBookButton />
      </View>
    </View>
  );
}
