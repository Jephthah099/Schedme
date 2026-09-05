import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Menu } from "lucide-react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { ScheduleBlock } from "../components/ScheduleBlock";
import { useAppStore } from "../store/useAppStore";
import { activitiesOnDate } from "../lib/deriveStats";
import { toISODate, weekDates } from "../lib/time";
import { color, font, radius } from "../theme/tokens";

const GRID_START = 6 * 60;
const GRID_END = 22 * 60;
const ROW_HEIGHT = 62;
const ROWS = (GRID_END - GRID_START) / 60;

export function TodayScreen() {
  const activities = useAppStore((s) => s.activities);
  const day = useAppStore((s) => s.day);
  const setDay = useAppStore((s) => s.setDay);
  const rescheduleActivity = useAppStore((s) => s.rescheduleActivity);
  const toggleDone = useAppStore((s) => s.toggleDone);

  const week = weekDates(new Date());
  const todayIso = toISODate(new Date());
  const selectedDate = week.find((d) => toISODate(d) === day) ?? new Date();
  const dayActivities = activitiesOnDate(activities, selectedDate);

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNowLine = day === todayIso && nowMin >= GRID_START && nowMin <= GRID_END;
  const nowTop = ((nowMin - GRID_START) / 60) * ROW_HEIGHT;

  return (
    <Screen>
      {/* Day strip */}
      <View style={styles.dayStrip}>
        {week.map((d) => {
          const iso = toISODate(d);
          const selected = iso === day;
          return (
            <Pressable
              key={iso}
              onPress={() => setDay(iso)}
              style={[styles.dayCell, selected && { backgroundColor: color.ink }]}
            >
              <Text style={[styles.dayDow, selected && { color: color.canvasGround }]}>
                {"SMTWTFS"[d.getDay()]}
              </Text>
              <Text style={[styles.dayDate, selected && { color: color.canvasGround }]}>
                {d.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Hint banner */}
      <View style={styles.hint}>
        <Menu size={16} color={color.accent700} />
        <Text style={styles.hintText}>Drag a block to reschedule it — its reminder moves too.</Text>
      </View>

      {/* Time grid */}
      <Card style={styles.gridCard} padded={false}>
        <View style={{ height: ROWS * ROW_HEIGHT + 20, paddingTop: 20 }}>
          {Array.from({ length: ROWS }).map((_, i) => {
            const hour = 6 + i;
            return (
              <View key={hour} style={[styles.row, { height: ROW_HEIGHT }]}>
                <Text style={styles.rowLabel}>{String(hour).padStart(2, "0")}:00</Text>
                <View style={styles.rowRule} />
              </View>
            );
          })}

          {showNowLine && (
            <View style={[styles.nowLine, { top: 20 + nowTop }]} pointerEvents="none">
              <View style={styles.nowDot} />
              <View style={styles.nowRule} />
              <Text style={styles.nowLabel}>NOW</Text>
            </View>
          )}

          {dayActivities.map((a) => (
            <ScheduleBlock
              key={a.id}
              activity={a}
              rowHeight={ROW_HEIGHT}
              gridStartMinutes={GRID_START}
              onDragEnd={rescheduleActivity}
              onToggleDone={toggleDone}
            />
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayStrip: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  dayCell: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.surface,
  },
  dayDow: {
    fontFamily: font.semibold,
    fontSize: 9.5,
    color: "rgba(32,30,29,0.65)",
    textTransform: "uppercase",
  },
  dayDate: {
    marginTop: 2,
    fontFamily: font.bold,
    fontSize: 16,
    color: color.ink,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 14,
    marginTop: 10,
    padding: 12,
    borderRadius: radius.hint,
    backgroundColor: color.accent100,
  },
  hintText: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 11.5,
    color: color.accent900,
  },
  gridCard: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 26,
    padding: 14,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowLabel: {
    width: 44,
    fontFamily: font.bold,
    fontSize: 10,
    color: "rgba(32,30,29,0.45)",
  },
  rowRule: {
    flex: 1,
    height: 1,
    backgroundColor: color.hairline,
    marginTop: 6,
  },
  nowLine: {
    position: "absolute",
    left: 54,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.accent,
  },
  nowRule: {
    flex: 1,
    height: 2,
    backgroundColor: color.accent,
  },
  nowLabel: {
    position: "absolute",
    right: 0,
    fontFamily: font.bold,
    fontSize: 9.5,
    color: color.accent,
  },
});
