import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SettingsIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import "@/global.css";

import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { useBookStore } from "@/store/useBookStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function App() {
  return (
    <>
      <Stack
        screenOptions={{
          header: (props) => (
            <View className="justify-between items-center flex-row px-6 h-16 bg-white">
              <Text className="text-xl font-outfit-bold text-pink-600">
                Cherry Reader
              </Text>

              <Pressable className="w-10 h-10 justify-center items-center">
                <SettingsIcon size={24} strokeWidth={1.5} />
              </Pressable>
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true }} />
      </Stack>

      <StatusBar style="auto" backgroundColor="#FFF" />
    </>
  );
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Bold": require("@/assets/fonts/Outfit-Bold.ttf"),
    "Outfit-Regular": require("@/assets/fonts/Outfit-Regular.ttf"),
  });

  const { selectLocaleDirectory, directory } = useLibraryStore();
  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations
  );

  useEffect(() => {
    async function setup() {
      if ((fontsLoaded || fontError) && migrationSuccess) {
        try {
          // await selectLocaleDirectory();
          await useBookStore.getState().hydrate();
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setIsAppReady(true);
          await SplashScreen.hideAsync();
        }
      }

      setIsAppReady(true);
    }

    setup();
  }, [
    fontsLoaded,
    fontError,
    migrationSuccess,
    directory,
    selectLocaleDirectory,
  ]);

  if (migrationError)
    return (
      <ScrollView>
        <Text>Database migration failed</Text>
        <Text>{migrationError.message}</Text>
      </ScrollView>
    );

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1">
        <App />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
