import { useBookStore } from "@/store/useBookStore";
import { useSearchStore } from "@/store/useSearchStore";
import { TrashIcon } from "lucide-react-native";
import Button from "./ui/button";

export default function DeleteSelectedBookButton() {
  const { deleteSelectedBooks } = useBookStore();

  const onPress = async () => {
    useSearchStore.setState({ searchResult: {} });
    await deleteSelectedBooks();
  };

  return (
    <Button style="border-transparent" onPress={onPress}>
      <TrashIcon size={24} strokeWidth={1.5} color={"#E92F51"} />
    </Button>
  );
}
