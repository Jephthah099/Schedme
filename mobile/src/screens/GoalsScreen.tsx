import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { ProgressBarPill } from "../components/ProgressBarPill";
import { useAppStore } from "../store/useAppStore";
import { color, font } from "../theme/tokens";
import { round1 } from "../lib/deriveStats";

function formatDeadlineDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

export function GoalsScreen() {
  const streak = useAppStore((s) => s.streak);
  const goals = useAppStore((s) => s.goals);
  const deadlines = useAppStore((s) => s.deadlines);

  const missedIndex = streak.days.findIndex((d) => !d.kept);
  const recentThreeStart = Math.max(0, streak.days.length - 3);

  return (
    <Screen>
      {/* Streak card */}
      <Card style={styles.card}>
        <Text style={styles.eyebrow}>PLAN KEPT</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>{streak.current}</Text>
          <Text style={styles.streakLabel}>days running</Text>
        </View>
        <View style={styles.dotsRow}>
          {streak.days.map((d, i) => {
            const isRecent = i >= recentThreeStart && d.kept;
            return (
              <View
                key={d.id}
                style={[
                  styles.dot,
                  d.kept
                    ? { backgroundColor: isRecent ? color.accent : color.ink }
                    : { borderWidth: 1.5, borderColor: color.softBorder },
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.caption}>
          Two weeks.{" "}
          {missedIndex >= 0
            ? `One miss on the ${new Date(streak.days[missedIndex].date).getDate()}th — post-call day.`
            : "Every day kept."}
        </Text>
      </Card>

      {/* Weekly hour targets */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Weekly hour targets</Text>
        <View style={{ marginTop: 12, gap: 14 }}>
          {goals.map((g) => (
            <View key={g.id}>
              <View style={styles.goalRow}>
                <Text style={styles.goalName}>{g.subject}</Text>
                <Text style={styles.goalHours} numberOfLines={1}>
                  {round1(g.hoursDone)} / {g.hoursGoal} h
                </Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <ProgressBarPill
                  pct={g.hoursGoal > 0 ? g.hoursDone / g.hoursGoal : 0}
                  height={12}
                  fillColor={g.hoursDone / g.hoursGoal >= 0.8 ? color.ink : color.accent}
                />
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Deadlines */}
      <Card style={[styles.card, { marginBottom: 26 }]} padded={false}>
        <Text style={[styles.cardTitle, { padding: 18, paddingBottom: 8 }]}>Deadlines</Text>
        {deadlines.map((d, i) => (
          <View
            key={d.id}
            style={[
              styles.deadlineRow,
              i < deadlines.length - 1 && styles.deadlineDivider,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.deadlineTitle}>{d.title}</Text>
              <Text style={styles.deadlineSub}>{d.subtitle}</Text>
            </View>
            <Text
              style={[
                styles.deadlineDays,
                d.daysLeft <= 10 && { color: color.accent700 },
              ]}
            >
              {d.daysLeft} d
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  eyebrow: {
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: color.accent700,
    textTransform: "uppercase",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginTop: 6,
  },
  streakNumber: {
    fontFamily: font.bold,
    fontSize: 62,
    lineHeight: 53,
    letterSpacing: -2.48,
    color: color.ink,
  },
  streakLabel: {
    fontFamily: font.bold,
    fontSize: 16,
    color: color.mutedText,
  },
  dotsRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dot: {
    width: "6%",
    height: 26,
    borderRadius: 9,
  },
  caption: {
    marginTop: 12,
    fontFamily: font.regular,
    fontSize: 12,
    color: color.mutedText,
  },
  cardTitle: {
    fontFamily: font.bold,
    fontSize: 15,
    color: color.ink,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalName: {
    fontFamily: font.bold,
    fontSize: 12.5,
    color: color.ink,
  },
  goalHours: {
    fontFamily: font.regular,
    fontSize: 11,
    color: color.mutedText,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  deadlineDivider: {
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  deadlineTitle: {
    fontFamily: font.bold,
    fontSize: 13,
    lineHeight: 18,
    color: color.ink,
  },
  deadlineSub: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 11,
    color: color.mutedText,
  },
  deadlineDays: {
    fontFamily: font.bold,
    fontSize: 15,
    color: color.ink,
  },
});
