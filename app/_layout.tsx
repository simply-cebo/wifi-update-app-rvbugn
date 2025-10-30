
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientProvider } from "@/contexts/ClientContext";
import React, { useEffect } from "react";
import { useNetworkState } from "expo-network";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Button } from "@/components/button";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isConnected } = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ClientProvider>
          <WidgetProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <SystemBars style="auto" />
              <StatusBar style="auto" />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                  name="client-detail"
                  options={{
                    presentation: "modal",
                    title: "Client Details",
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    title: "Modal",
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.5, 1],
                    sheetGrabberVisible: true,
                    title: "Form Sheet",
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: "transparentModal",
                    animation: "fade",
                    title: "Transparent Modal",
                  }}
                />
              </Stack>
            </ThemeProvider>
          </WidgetProvider>
        </ClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
