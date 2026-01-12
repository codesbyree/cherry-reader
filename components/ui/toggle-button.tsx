import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";
import { Pressable, View, type PressableProps } from "react-native";

interface ButtonToggleProps extends Omit<PressableProps, "style"> {
  state: boolean;
  children: ReactNode[];
  contentStyle?: ClassValue;
  style?: ClassValue;
}

export default function ToggleButton(props: ButtonToggleProps) {
  const contentRenderer = () => {
    if (props.state) return props.children[1];
    return props.children[0];
  };

  return (
    <Pressable
      className={cn(
        "border border-pink-200 rounded-lg h-10 min-w-10 justify-center",
        props.style
      )}
      onPress={props.onPress}
    >
      <View
        className={cn(
          "flex-1 items-center gap-2 justify-center",
          props.contentStyle
        )}
      >
        {contentRenderer()}
      </View>
    </Pressable>
  );
}
