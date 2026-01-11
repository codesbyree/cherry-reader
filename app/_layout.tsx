import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import "@/global.css";

import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { useBookStore } from "@/store/useBookStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBar from "@/components/app-bar";

SplashScreen.preventAutoHideAsync();

function App() {
  useEffect(() => {
    async function syncLibrary() {
      await useLibraryStore.getState().syncLibrary();
    }

    syncLibrary();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#FFF" },
          animation: "ios_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ header: () => <AppBar /> }} />
        <Stack.Screen name="reader" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
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

  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations
  );

  useEffect(() => {
    async function setup() {
      if ((fontsLoaded || fontError) && migrationSuccess) {
        try {
          await useLibraryStore.getState().selectLocaleDirectory();
          await useBookStore.getState().hydrate();
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setIsAppReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    setup();
  }, [fontsLoaded, fontError, migrationSuccess]);

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
