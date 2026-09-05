import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { color, font } from "../theme/tokens";

interface Props {
  height: number;
  label?: string;
  style?: any;
}

// Stand-in for the design's unfilled photo placeholders (README: "Photography is
// unfilled"). Swap for a real <Image> once licensed photographs are supplied.
export function PhotoSlot({ height, label = "Photo", style }: Props) {
  return (
    <View style={[styles.box, { height }, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#d8d6d5",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: font.semibold,
    fontSize: 11,
    color: color.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
