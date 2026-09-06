import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { useAppStore } from "../store/useAppStore";
import { color, font, radius, shadow } from "../theme/tokens";

export function Banner() {
  const banner = useAppStore((s) => s.banner);
  const dismissBanner = useAppStore((s) => s.dismissBanner);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: banner ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [banner]);

  if (!banner) return null;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }),
            },
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable style={styles.card} onPress={dismissBanner}>
        <Bell size={18} color={color.accent500} />
        <View style={styles.textCol}>
          <Text style={styles.eyebrow}>SCHEDME · NOW</Text>
          <Text style={styles.message}>{banner}</Text>
        </View>
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
