import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PRIMARY } from "../constants";

export default function RootLayout() {
  useEffect(() => {
    // Define a cor de fundo da navigation bar (rodapé) no Android
    SystemUI.setBackgroundColorAsync(PRIMARY);
  }, []);

  return (
    <SafeAreaProvider>
      {/* style="light" → ícones/texto brancos na status bar */}
      <StatusBar style="light" backgroundColor={PRIMARY} translucent={false} />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}


