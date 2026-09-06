import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
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
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 150,
      useNativeDriver: false, // backgroundColor isn't supported by the native driver
    }).start();
  }, [value]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", color.accent],
  });
  const knobColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [color.ink, "#f3f2f2"],
  });
  const knobTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WIDTH - KNOB - PADDING * 2],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={[styles.track, { borderColor: color.softBorder }]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.trackFill, { backgroundColor: trackColor }]}
      />
      <Animated.View
        style={[styles.knob, { backgroundColor: knobColor, transform: [{ translateX: knobTranslate }] }]}
      />
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
