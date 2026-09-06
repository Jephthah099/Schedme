import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { color, radius } from "../theme/tokens";

interface Props {
  pct: number; // 0-1
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBarPill({
  pct,
  height = 14,
  trackColor = color.track,
  fillColor = color.accent,
}: Props) {
  const clamped = Math.max(0, Math.min(1, pct));
  const width = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: 350,
      useNativeDriver: false, // width isn't supported by the native driver
    }).start();
  }, [clamped]);

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: radius.pill }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            backgroundColor: fillColor,
            borderRadius: radius.pill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
