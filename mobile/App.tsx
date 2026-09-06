import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
// Importing from the package root would bundle all 18 Archivo weight/style
// files even though only 3 are used — these subpath imports pull in just
// the specific font files (and useFonts, which has no font assets of its own).
import { useFonts } from "@expo-google-fonts/archivo/useFonts";
import { Archivo_400Regular } from "@expo-google-fonts/archivo/400Regular";
import { Archivo_600SemiBold } from "@expo-google-fonts/archivo/600SemiBold";
import { Archivo_800ExtraBold } from "@expo-google-fonts/archivo/800ExtraBold";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { Banner } from "./src/components/Banner";
import { useAppStore } from "./src/store/useAppStore";
import { color } from "./src/theme/tokens";
import { ensureAndroidChannel } from "./src/notifications/scheduler";

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    ensureAndroidChannel();
    hydrate();
  }, [hydrate]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={color.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            <RootNavigator />
            <Banner />
          </View>
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.ground,
  },
});
