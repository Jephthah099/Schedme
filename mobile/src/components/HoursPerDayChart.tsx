import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DayBar } from "../lib/deriveStats";
import { color, font, radius } from "../theme/tokens";

const BOX_HEIGHT = 112;
const SCALE_HOURS = 9;

function AnimatedBar({ heightPx, color: fill }: { heightPx: number; color: string }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withTiming(heightPx, { duration: 500 });
  }, [heightPx]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[styles.actualBar, style, { backgroundColor: fill }]} />;
}

export function HoursPerDayChart({ days }: { days: DayBar[] }) {
  return (
    <View style={styles.row}>
      {days.map((d) => {
        const plannedH = Math.min(BOX_HEIGHT, (d.planned / SCALE_HOURS) * BOX_HEIGHT);
        const actualH = Math.min(BOX_HEIGHT, (d.actual / SCALE_HOURS) * BOX_HEIGHT);
        return (
          <View key={d.iso} style={styles.col}>
            <View style={styles.barsBox}>
              <View style={[styles.plannedBar, { height: plannedH }]} />
              <AnimatedBar heightPx={actualH} color={d.isToday ? color.accent : color.ink} />
            </View>
            <Text style={[styles.letter, d.isToday && { color: color.accent700 }]}>{d.letter}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  col: {
    flex: 1,
    alignItems: "center",
  },
  barsBox: {
    height: BOX_HEIGHT,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
  },
  plannedBar: {
    flex: 1,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: "rgba(32,30,29,0.28)",
    borderTopLeftRadius: radius.chartBarTop,
    borderTopRightRadius: radius.chartBarTop,
  },
  actualBar: {
    flex: 1,
    borderTopLeftRadius: radius.chartBarTop,
    borderTopRightRadius: radius.chartBarTop,
  },
  letter: {
    marginTop: 6,
    fontFamily: font.bold,
    fontSize: 9.5,
    color: color.ink,
  },
});
