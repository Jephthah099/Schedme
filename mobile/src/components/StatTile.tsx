import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { color, font } from "../theme/tokens";

interface Props {
  number: string;
  label: string;
  numberColor?: string;
}

export function StatTile({ number, label, numberColor = color.ink }: Props) {
  return (
    <Card style={styles.tile} padded={false}>
      <Text style={[styles.number, { color: numberColor }]}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  number: {
    fontFamily: font.bold,
    fontSize: 30,
    lineHeight: 30,
  },
  label: {
    marginTop: 6,
    fontFamily: font.bold,
    fontSize: 10.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: color.mutedText,
  },
});
