import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

import { Book } from "@/db/schema";

export default function BookCard(props: Book) {
  return (
    <View className="w-[174px] h-[272px] border border-slate-300 rounded-[14px] bg-slate-50 overflow-hidden justify-end">
      <View className="p-4 relative z-20">
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
    </View>
  );
}
