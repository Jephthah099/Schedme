import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { color } from "../theme/tokens";

interface Props {
  value: boolean;
  onChange: (next: boolean) => void;
}

const WIDTH = 52;
const HEIGHT = 30;
const PADDING = 3;
const KNOB = HEIGHT - PADDING * 2;

export function ToggleSwitch({ value, onChange }: Props) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 150 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: value ? color.accent : "transparent",
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (WIDTH - KNOB - PADDING * 2) }],
    backgroundColor: value ? "#f3f2f2" : color.ink,
  }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={[styles.track, { borderColor: color.softBorder }]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.trackFill, trackStyle]} />
      <Animated.View style={[styles.knob, knobStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    borderWidth: 1.5,
    padding: PADDING,
    justifyContent: "center",
  },
  trackFill: {
    borderRadius: HEIGHT / 2,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
  },
});
