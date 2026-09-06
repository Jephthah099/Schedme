import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Check } from "lucide-react-native";
import { Activity } from "../types";
import { categoryStyle, color, font, radius, shadow } from "../theme/tokens";
import { formatTimeRange } from "../lib/time";
import { HatchOverlay } from "./HatchOverlay";
import { useAppStore } from "../store/useAppStore";

interface Props {
  activity: Activity;
  rowHeight: number;
  gridStartMinutes: number;
  onDragEnd: (id: string, newStart: number) => void;
  onToggleDone: (id: string) => void;
}

export function ScheduleBlock({ activity, rowHeight, gridStartMinutes, onDragEnd, onToggleDone }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const dragDelta = useRef(0);
  const setDragId = useAppStore((s) => s.setDragId);

  const top = ((activity.start - gridStartMinutes) / 60) * rowHeight;
  const height = Math.max(56, (activity.duration / 60) * rowHeight - 6);
  const cat = categoryStyle[activity.category];

  // Runs on the JS thread (see .runOnJS(true) below) so plain Animated.Value
  // updates are safe here without needing react-native-reanimated worklets.
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      setIsDragging(true);
      setDragId(activity.id);
    })
    .onUpdate((e) => {
      dragDelta.current = e.translationY;
      translateY.setValue(e.translationY);
    })
    .onEnd(() => {
      const deltaMinutes = Math.round((dragDelta.current / rowHeight) * 60 / 15) * 15;
      Animated.timing(translateY, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      setIsDragging(false);
      setDragId(null);
      onDragEnd(activity.id, activity.start + deltaMinutes);
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.block,
          { transform: [{ translateY }] },
          {
            top,
            height,
            left: 54,
            right: 0,
            backgroundColor: cat.fill,
            borderWidth: activity.category === "Lab" || activity.category === "Study" ? 2 : 0,
            borderColor: cat.border,
            zIndex: isDragging ? 6 : 1,
            elevation: isDragging ? 16 : 0,
          },
          isDragging && shadow.dragged,
        ]}
      >
        {!activity.done && <HatchOverlay />}
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { borderColor: cat.text }]}>
              <Text style={[styles.tagText, { color: cat.text }]}>{activity.category}</Text>
            </View>
            <Text style={[styles.time, { color: cat.text }]} numberOfLines={1}>
              {formatTimeRange(activity.start, activity.duration)}
            </Text>
          </View>
          <Text style={[styles.title, { color: cat.text }]} numberOfLines={1}>
            {activity.title}
          </Text>
          <Text style={[styles.place, { color: cat.text, opacity: 0.72 }]} numberOfLines={1}>
            {activity.place}
          </Text>
        </View>
        <Pressable
          onPress={() => onToggleDone(activity.id)}
          style={[
            styles.completeBtn,
            { borderColor: cat.text, backgroundColor: activity.done ? "rgba(255,255,255,0.16)" : "transparent" },
          ]}
          hitSlop={4}
        >
          {activity.done && <Check size={18} color={cat.text} strokeWidth={3} />}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    borderRadius: radius.tile,
    overflow: "hidden",
    flexDirection: "row",
  },
  body: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tagText: {
    fontFamily: font.bold,
    fontSize: 8.5,
    letterSpacing: 1,
  },
  time: {
    fontFamily: font.semibold,
    fontSize: 10.5,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 13.5,
  },
  place: {
    fontFamily: font.regular,
    fontSize: 10.5,
  },
  completeBtn: {
    width: 48,
    borderLeftWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
