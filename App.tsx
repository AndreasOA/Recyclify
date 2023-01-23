import * as React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import { default as customTheme } from "./src/constants/theme/appTheme.json";
import { default as customMapping } from "./src/constants/theme/mapping.json";
import * as eva from "@eva-design/eva";
import SignNavigator from "navigation/LoginNavigator";
import { LogBox } from "react-native";
import useCachedResources from "hooks/useCacheResource";
import { DarkTheme } from "@react-navigation/native";

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
  "Sending `onReanimatedPropsChange` with no listeners registered.",
]);
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <SafeAreaProvider>
        <ApplicationProvider
          {...eva}
          theme={{ ...eva.light, ...customTheme, ...DarkTheme }}
          customMapping={{ ...eva.mapping, ...customMapping }}
        >
        <SignNavigator></SignNavigator>
        </ApplicationProvider>
    </SafeAreaProvider>
  );
}
