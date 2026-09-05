import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color, font, radius } from "../theme/tokens";

interface Props {
  value: number; // minutes
  onChange: (next: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export function Stepper({ value, onChange, step = 15, min = 15, max = 240 }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.cell}
        onPress={() => onChange(Math.max(min, value - step))}
        hitSlop={8}
      >
        <Text style={styles.symbol}>−</Text>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.value}>{value} min</Text>
      </View>
      <Pressable
        style={[styles.cell, styles.cellRight]}
        onPress={() => onChange(Math.min(max, value + step))}
        hitSlop={8}
      >
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    height: 46,
    borderRadius: radius.hint,
    overflow: "hidden",
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.softBorder,
  },
  cell: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: color.hairline,
  },
  cellRight: {
    borderRightWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: color.hairline,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    fontFamily: font.bold,
    fontSize: 18,
    color: color.ink,
  },
  value: {
    fontFamily: font.bold,
    fontSize: 13,
    color: color.ink,
  },
});
