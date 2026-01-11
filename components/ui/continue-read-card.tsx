import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

import { Book } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useSelectedBookStore } from "@/store/useSelectedBookStore";
import { useRouter } from "expo-router";
import { CheckCircleIcon } from "lucide-react-native";

export default function ContinueReadCard(props: Book) {
  const {
    addToSelectedBooks,
    removeFromSelectedBooks,
    selectedBooks,
    isSelectingBooks,
  } = useSelectedBookStore();
  const isSelected = selectedBooks.hasOwnProperty(Number(props.id));

  const router = useRouter();

  const onShortPress = () => {
    if (isSelected) return removeFromSelectedBooks(Number(props.id));
    else if (!isSelected && isSelectingBooks) addToSelectedBooks(props);
    else
      router.push({
        pathname: "/reader",
        params: { id: props.id, title: props.title, path: props.path },
      });
  };

  const onLongPress = () => {
    if (isSelected) removeFromSelectedBooks(Number(props.id));
    else addToSelectedBooks(props);
  };

  return (
    <Pressable onPress={onShortPress} onLongPress={onLongPress}>
      <View className="w-[148px] h-[231px] border border-slate-300 rounded-[14px] bg-slate-50 overflow-hidden justify-end">
        <View className="p-[10px] relative z-20">
          <View className="gap-1">
            <Text
              className="font-outfit text-base leading-4 text-slate-50"
              numberOfLines={2}
            >
              {props.title}
            </Text>
            <Text
              className="font-outfit text-[13px] leading-4 text-slate-50/70"
              numberOfLines={2}
            >
              {props.author}
            </Text>
          </View>
        </View>

        <Image
          src={props.image}
          className="absolute top-0 left-0 w-full h-full"
        />

        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,.1)",
            "rgba(0,0,0,.4)",
            "rgba(0,0,0,.9)",
          ]}
          className="h-3/4 absolute bottom-0 w-full z-10"
        />

        <View
          className={cn(
            "absolute w-full h-full z-30 bg-pink-400/50",
            isSelected ? "flex" : "hidden"
          )}
        />

        <View
          className={cn(
            "absolute z-50 w-8 h-8 bg-pink-600 top-2 right-2 rounded-full items-center justify-center",
            isSelected ? "flex" : "hidden"
          )}
        >
          <CheckCircleIcon size={24} color={"#FFF"} strokeWidth={1.5} />
        </View>
      </View>
    </Pressable>
  );
}
