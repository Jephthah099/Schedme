import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Header } from "./Header";
import { useGoToNotifications } from "../navigation/useGoToNotifications";
import { color } from "../theme/tokens";

interface Props {
  children: React.ReactNode;
  contentContainerStyle?: any;
}

export function Screen({ children, contentContainerStyle }: Props) {
  const goToNotifications = useGoToNotifications();
  return (
    <View style={styles.root}>
      <Header onPressBell={goToNotifications} />
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.ground,
  },
  content: {
    paddingBottom: 26,
  },
});
