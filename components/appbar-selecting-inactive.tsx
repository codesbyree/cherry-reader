import { SettingsIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import LibrarySyncingIndicator from "./library-syncing-indicator";
import Button from "./ui/button";

export default function AppBarBookSelectingInactive() {
  return (
    <View className="flex-1 justify-between items-center flex-row">
      <Text className="text-xl font-outfit-bold text-pink-600">
        Cherry Reader
      </Text>

      <View className="flex-row items-center gap-2">
        <LibrarySyncingIndicator />

        <Button style="border-transparent">
          <SettingsIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
        </Button>
      </View>
    </View>
  );
}
