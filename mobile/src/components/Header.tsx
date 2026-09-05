import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { color, font } from "../theme/tokens";
import { formatHeaderDate } from "../lib/time";

interface Props {
  onPressBell: () => void;
  unread?: boolean;
}

export function Header({ onPressBell, unread = true }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.wordmark}>SCHUDME</Text>
        <Text style={styles.date} numberOfLines={1}>
          {formatHeaderDate(new Date())}
        </Text>
      </View>
      <Pressable onPress={onPressBell} style={styles.bellButton} hitSlop={8}>
        <Bell size={20} color={color.ink} />
        {unread && <View style={styles.dot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 62,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: color.ground,
  },
  wordmark: {
    fontFamily: font.bold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: color.ink,
  },
  date: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 11.5,
    color: color.mutedText,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.accent,
  },
});
