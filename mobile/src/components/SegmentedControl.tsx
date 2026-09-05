import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color, font } from "../theme/tokens";

interface Props<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string | number>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              {
                backgroundColor: selected ? color.accent : "transparent",
                borderColor: color.softBorder,
                borderTopLeftRadius: isFirst ? 999 : 0,
                borderBottomLeftRadius: isFirst ? 999 : 0,
                borderTopRightRadius: isLast ? 999 : 0,
                borderBottomRightRadius: isLast ? 999 : 0,
                borderLeftWidth: isFirst ? 1.5 : 0,
              },
            ]}
          >
            <Text style={[styles.label, { color: selected ? color.surface : color.ink }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 44,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },
  label: {
    fontFamily: font.bold,
    fontSize: 13,
  },
});
