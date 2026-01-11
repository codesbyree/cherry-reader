import { useBookStore } from "@/store/useBookStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Reader() {
  const { id, path, title } = useLocalSearchParams();
  const { addBookToRecentyRead } = useBookStore();

  useEffect(() => {
    async function addToRead() {
      await addBookToRecentyRead(Number(id));
    }

    addToRead();
  }, [id, addBookToRecentyRead]);

  return (
    <View>
      <Text>
        {id} - {title}
      </Text>

      <Text>{path}</Text>
    </View>
  );
}
