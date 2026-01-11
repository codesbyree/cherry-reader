import {
  LoaderIcon,
  SettingsIcon,
  SquareCheckIcon,
  SquareIcon,
  TagsIcon,
  TrashIcon,
  XIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";

import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/useLibraryStore";

import { useBookStore } from "@/store/useBookStore";
import { useSelectedBookStore } from "@/store/useSelectedBookStore";
import Button from "./ui/button";

export default function AppBar() {
  const {
    selectedBooksLength,
    clearSelectedBooksList,
    selectAllBooks,
    isAllBooksSelected,
    stopSelectingBooks,
    isSelectingBooks,
  } = useSelectedBookStore();

  const closeBooksSelection = () => {
    clearSelectedBooksList();
    stopSelectingBooks();
  };

  const contentRenderer = () => {
    if (isSelectingBooks)
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

            <Button
              style="border-transparent"
              contentStyle="flex-row"
              onPress={
                !isAllBooksSelected ? selectAllBooks : clearSelectedBooksList
              }
            >
              {isAllBooksSelected ? (
                <SquareCheckIcon
                  size={24}
                  strokeWidth={1.5}
                  color={"#E92F51"}
                />
              ) : (
                <SquareIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
              )}
              <Text className="font-outfit text-base text-slate-900">
                Select All
              </Text>
            </Button>
          </View>

          <View className="flex-row gap-2">
            <Button style="border-transparent">
              <TagsIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
            </Button>

            <DeleteSelectedBooks />
          </View>
        </View>
      );

    return (
      <View className="flex-1 justify-between items-center flex-row">
        <Text className="text-xl font-outfit-bold text-pink-600">
          Cherry Reader
        </Text>

        <View className="flex-row items-center gap-2">
          <LibrarySyncIndicator />

          <Button style="border-transparent">
            <SettingsIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View className="px-6 pr-[14px] h-16 bg-white">{contentRenderer()}</View>
  );
}

function DeleteSelectedBooks() {
  const { deleteSelectedBooks } = useBookStore();

  const onPress = async () => {
    await deleteSelectedBooks();
  };

  return (
    <Button style="border-transparent" onPress={onPress}>
      <TrashIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
    </Button>
  );
}

function LibrarySyncIndicator() {
  const { isSyncing, newFilesCount, newFilesSyncedCount } = useLibraryStore();

  return (
    <View
      className={cn(
        "bg-pink-100 p-1 rounded-full border h-8 justify-center border-pink-200 flex-row items-center gap-1",
        isSyncing ? "flex" : "hidden"
      )}
    >
      <Text className="font-outfit text-xs p-1 px-2 text-pink-50 bg-pink-800 rounded-full">
        Syncing files {newFilesSyncedCount}/{newFilesCount}
      </Text>

      <View className="animate-spin duration-1000 repeat-infinite bg-pink-800 rounded-full p-1">
        <LoaderIcon size={14} strokeWidth={1.5} color={"#FDF2F8"} />
      </View>
    </View>
  );
}
