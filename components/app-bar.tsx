import { View } from "react-native";

import { useSelectedBookStore } from "@/store/useSelectedBookStore";

import AppBarBookSelectingActive from "./appbar-selecting-active";
import AppBarBookSelectingInactive from "./appbar-selecting-inactive";

export default function AppBar() {
  const { isSelectingBooks } = useSelectedBookStore();

  const contentRenderer = () => {
    if (isSelectingBooks) return <AppBarBookSelectingActive />;
    return <AppBarBookSelectingInactive />;
  };

  return (
    <View className="px-6 pr-[14px] h-16 bg-white">{contentRenderer()}</View>
  );
}
