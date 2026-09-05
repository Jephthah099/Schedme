import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
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
  const width = useSharedValue(clamped);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 350 });
  }, [clamped]);

  const style = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: radius.pill }]}>
      <Animated.View
        style={[styles.fill, style, { backgroundColor: fillColor, borderRadius: radius.pill }]}
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
