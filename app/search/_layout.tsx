import { Stack } from "expo-router";

import SearchBar from "@/components/search-bar";

export default function SearchScreenLayout() {
  return (
    <Stack
      initialRouteName="search-form"
      screenOptions={{ header: (props) => <SearchBar /> }}
    >
      <Stack.Screen name="search-form" />
      <Stack.Screen name="search-result" />
    </Stack>
  );
}
