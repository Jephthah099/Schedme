import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { color, radius, shadow } from "../theme/tokens";

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ style, padded = true, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    ...shadow.card,
  },
  padded: {
    padding: 18,
  },
});
