import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Bell } from "lucide-react-native";
import { useAppStore } from "../store/useAppStore";
import { color, font, radius, shadow } from "../theme/tokens";

export function Banner() {
  const banner = useAppStore((s) => s.banner);
  const dismissBanner = useAppStore((s) => s.dismissBanner);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(banner ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.ease),
    });
  }, [banner]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -80 }],
  }));

  if (!banner) return null;

  return (
    <Animated.View style={[styles.wrap, style]} pointerEvents="box-none">
      <Pressable style={styles.card} onPress={dismissBanner}>
        <Bell size={18} color={color.accent500} />
        <Animated.View style={styles.textCol}>
          <Text style={styles.eyebrow}>SCHUDME · NOW</Text>
          <Text style={styles.message}>{banner}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 58,
    left: 12,
    right: 12,
    zIndex: 60,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    backgroundColor: color.ink,
    borderRadius: radius.tile,
    paddingVertical: 13,
    paddingHorizontal: 16,
    ...shadow.banner,
  },
  textCol: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: "rgba(243,242,242,0.6)",
    textTransform: "uppercase",
  },
  message: {
    marginTop: 2,
    fontFamily: font.semibold,
    fontSize: 13,
    color: color.surface,
  },
});
