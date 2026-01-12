import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/useLibraryStore";
import { LoaderIcon } from "lucide-react-native";
import { Text, View } from "react-native";

export default function LibrarySyncingIndicator() {
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
