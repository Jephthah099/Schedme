import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { StatTile } from "../components/StatTile";
import { ProgressBarPill } from "../components/ProgressBarPill";
import { GoalRing } from "../components/GoalRing";
import { HoursPerDayChart } from "../components/HoursPerDayChart";
import { PhotoSlot } from "../components/PhotoSlot";
import { useAppStore } from "../store/useAppStore";
import {
  activitiesOnDate,
  blocksCompleted,
  heroStats,
  hoursOf,
  hoursPerDay,
  plannedVsActualPct,
  round1,
} from "../lib/deriveStats";
import { color, font } from "../theme/tokens";

export function ProgressScreen() {
  const activities = useAppStore((s) => s.activities);
  const goals = useAppStore((s) => s.goals);
  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.streak);

  const today = activitiesOnDate(activities, new Date());
  const hero = heroStats(today, profile?.dailyTargetH ?? 8);
  const blocks = blocksCompleted(today);
  const pctWeek = plannedVsActualPct(activities);
  const days = hoursPerDay(activities, new Date());

  return (
    <Screen>
      {/* Hero card */}
      <Card style={styles.hero}>
        <Text style={styles.eyebrow}>STUDY HOURS LOGGED TODAY</Text>
        <View style={styles.heroMetricRow}>
          <Text style={styles.heroMetric}>{round1(hero.doneHours)}</Text>
          <Text style={styles.heroTarget}>/ {hero.targetHours} h</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <ProgressBarPill pct={hero.pct} />
        </View>
        <View style={styles.heroFooterRow}>
          <Text style={styles.heroFooterText}>{hero.footerLeft}</Text>
          <Text style={styles.heroFooterText}>{hero.footerRight}</Text>
        </View>
      </Card>

      {/* Summary tiles */}
      <View style={styles.tileGrid}>
        <View style={styles.tileRow}>
          <StatTile number={`${round1(hoursOf(activities))}`} label="Hours this week" />
          <StatTile number={`${pctWeek}%`} label="Planned vs actual" />
        </View>
        <View style={styles.tileRow}>
          <StatTile number={blocks.label} label="Blocks completed" />
          <StatTile number={`${streak.current}d`} label="Current streak" numberColor={color.accent700} />
        </View>
      </View>

      {/* Hours per day */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            Hours per day
          </Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { borderWidth: 1.5, borderColor: color.ink }]} />
            <Text style={styles.legendText}>PLANNED</Text>
            <View style={[styles.legendDot, { backgroundColor: color.ink, marginLeft: 10 }]} />
            <Text style={styles.legendText}>ACTUAL</Text>
          </View>
        </View>
        <View style={{ marginTop: 14 }}>
          <HoursPerDayChart days={days} />
        </View>
      </Card>

      {/* Weekly subject goals */}
      <Card style={styles.goalsCard}>
        <Text style={styles.cardTitle}>Weekly subject goals</Text>
        <View style={styles.ringRow}>
          {goals.map((g) => (
            <View key={g.id} style={styles.ringCol}>
              <GoalRing pct={g.hoursGoal > 0 ? g.hoursDone / g.hoursGoal : 0} />
              <Text style={styles.ringSubject} numberOfLines={1}>
                {g.subject}
              </Text>
              <Text style={styles.ringHours} numberOfLines={1}>
                {round1(g.hoursDone)} / {g.hoursGoal} h
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Photo card */}
      <Card style={styles.photoCard} padded={false}>
        <PhotoSlot height={180} label="Clinical skills" />
        <View style={styles.photoTextWrap}>
          <Text style={styles.photoTitle}>Clinical skills block · Ward 4</Text>
          <Text style={styles.photoBody}>Your OSCE station is coming up — keep the reps steady.</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: 14,
    marginTop: 0,
  },
  eyebrow: {
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: color.accent700,
    textTransform: "uppercase",
  },
  heroMetricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 6,
  },
  heroMetric: {
    fontFamily: font.bold,
    fontSize: 74,
    lineHeight: 61,
    letterSpacing: -2.96,
    color: color.ink,
  },
  heroTarget: {
    fontFamily: font.bold,
    fontSize: 20,
    color: color.mutedText,
  },
  heroFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  heroFooterText: {
    fontFamily: font.regular,
    fontSize: 11,
    color: color.mutedText,
  },
  tileGrid: {
    gap: 10,
    marginHorizontal: 14,
    marginTop: 10,
  },
  tileRow: {
    flexDirection: "row",
    gap: 10,
  },
  chartCard: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  chartHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: font.bold,
    fontSize: 15,
    color: color.ink,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    marginLeft: 4,
    fontFamily: font.bold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: color.mutedText,
    textTransform: "uppercase",
  },
  goalsCard: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  ringRow: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },
  ringCol: {
    alignItems: "center",
    flex: 1,
  },
  ringSubject: {
    marginTop: 8,
    fontFamily: font.bold,
    fontSize: 11,
    color: color.ink,
  },
  ringHours: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 10.5,
    color: color.mutedText,
  },
  photoCard: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 26,
    overflow: "hidden",
  },
  photoTextWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  photoTitle: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
  },
  photoBody: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 12,
    color: color.mutedText,
  },
});
