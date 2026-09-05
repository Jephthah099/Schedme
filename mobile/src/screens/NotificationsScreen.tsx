import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../components/Card";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useAppStore } from "../store/useAppStore";
import { sendTestNotification } from "../notifications/scheduler";
import { ToggleKey } from "../types";
import { color, font, radius } from "../theme/tokens";

const TOGGLE_META: Record<ToggleKey, { title: string; description: string }> = {
  before: { title: "Before a block starts", description: "10 minutes ahead, with the room" },
  drift: { title: "Off-schedule nudge", description: "When a block runs 15 min past its slot" },
  recap: { title: "End-of-day recap", description: "21:30 — hours, blocks kept, tomorrow's first" },
  digest: { title: "Weekly statistics digest", description: "Sunday 18:00 — subject hours and trend" },
};
const ORDER: ToggleKey[] = ["before", "drift", "recap", "digest"];

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const toggles = useAppStore((s) => s.toggles);
  const setToggle = useAppStore((s) => s.toggle);
  const showBanner = useAppStore((s) => s.showBanner);

  const ordered = ORDER.map((key) => toggles.find((t) => t.key === key)).filter(Boolean) as typeof toggles;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>← PROFILE</Text>
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.sub}>Four jobs. Nothing else gets to interrupt a ward round.</Text>
        </View>

        <Card style={styles.togglesCard} padded={false}>
          {ordered.map((t, i) => {
            const meta = TOGGLE_META[t.key as ToggleKey];
            return (
              <View key={t.id} style={[styles.toggleRow, i < ordered.length - 1 && styles.rowDivider]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>{meta.title}</Text>
                  <Text style={styles.toggleDesc}>{meta.description}</Text>
                </View>
                <ToggleSwitch
                  value={t.enabled}
                  onChange={(next) => setToggle(t.key as ToggleKey, next)}
                />
              </View>
            );
          })}
        </Card>

        <Text style={styles.previewHeading}>What they look like</Text>
        <View style={styles.previewStack}>
          <PreviewCard
            variant="ink"
            title="Ward round in 10 minutes"
            body="Ward 4 · consultant round · 60 min"
          />
          <PreviewCard
            variant="accent"
            title="You are 15 minutes behind"
            body="Move OSCE practice to 18:00, or cut it to 45 min."
          />
          <PreviewCard
            variant="outline"
            title="5.5 of 8 study hours today"
            body="4 of 6 blocks kept. Tomorrow starts 08:00, Cardiology."
          />
          <PreviewCard
            variant="outline"
            title="Week 6: 31.5 h, up 2.5 h"
            body="Pharmacology is 2.5 h short of target."
          />
        </View>

        <Pressable
          style={styles.testBtn}
          onPress={() => {
            sendTestNotification();
            showBanner("Test notification sent.");
          }}
        >
          <Text style={styles.testBtnText}>Send a test notification</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function PreviewCard({
  variant,
  title,
  body,
}: {
  variant: "ink" | "accent" | "outline";
  title: string;
  body: string;
}) {
  const bg = variant === "ink" ? color.ink : variant === "accent" ? color.accent : color.surface;
  const textColor = variant === "outline" ? color.ink : color.surface;
  const mutedColor = variant === "outline" ? color.mutedText : "rgba(255,255,255,0.72)";
  return (
    <View
      style={[
        styles.previewCard,
        { backgroundColor: bg },
        variant === "outline" && { borderWidth: 1.5, borderColor: color.softBorder },
      ]}
    >
      <Text style={[styles.previewEyebrow, { color: mutedColor }]}>SCHUDME · 12:50</Text>
      <Text style={[styles.previewTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.previewBody, { color: mutedColor }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.ground,
  },
  content: {
    paddingTop: 62,
    paddingBottom: 26,
  },
  headerCard: {
    paddingHorizontal: 20,
  },
  backLink: {
    fontFamily: font.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: color.accent,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    fontFamily: font.bold,
    fontSize: 21,
    color: color.ink,
  },
  sub: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 12,
    color: color.mutedText,
  },
  togglesCard: {
    marginHorizontal: 14,
    marginTop: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  toggleTitle: {
    fontFamily: font.bold,
    fontSize: 13.5,
    color: color.ink,
  },
  toggleDesc: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 11.5,
    color: color.mutedText,
  },
  previewHeading: {
    marginHorizontal: 14,
    marginTop: 18,
    fontFamily: font.bold,
    fontSize: 15,
    color: color.ink,
  },
  previewStack: {
    marginHorizontal: 14,
    marginTop: 10,
    gap: 10,
  },
  previewCard: {
    borderRadius: radius.tile,
    padding: 14,
  },
  previewEyebrow: {
    fontFamily: font.bold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  previewTitle: {
    marginTop: 4,
    fontFamily: font.bold,
    fontSize: 14,
  },
  previewBody: {
    marginTop: 2,
    fontFamily: font.regular,
    fontSize: 12,
  },
  testBtn: {
    marginHorizontal: 14,
    marginTop: 18,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  testBtnText: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
  },
});
