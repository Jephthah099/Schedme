import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Bell, Clock, Calendar, Download } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { StatTile } from "../components/StatTile";
import { PhotoSlot } from "../components/PhotoSlot";
import { useAppStore } from "../store/useAppStore";
import { color, font } from "../theme/tokens";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const profile = useAppStore((s) => s.profile);
  const toggles = useAppStore((s) => s.toggles);

  const onCount = toggles.filter((t) => t.enabled).length;

  const rows = [
    {
      icon: Bell,
      label: "Notifications",
      value: `${onCount} of ${toggles.length} on`,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: Clock,
      label: "Daily study target",
      value: `${profile?.dailyTargetH ?? 8} hours`,
      onPress: () => {},
    },
    {
      icon: Calendar,
      label: "Timetable import",
      value: "Faculty calendar",
      onPress: () => {},
    },
    {
      icon: Download,
      label: "Export study log",
      value: "CSV",
      onPress: () => {},
    },
  ];

  if (!profile) return <Screen>{null}</Screen>;

  return (
    <Screen>
      <PhotoSlot height={168} label="Profile" style={styles.photo} />

      <Card style={styles.identityCard}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.subtitle}>{profile.subtitle}</Text>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: color.accent100 }]}>
            <Text style={[styles.tagText, { color: color.accent700 }]}>Cardiology block</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: color.canvasGround }]}>
            <Text style={styles.tagText}>Week 6 of 8</Text>
          </View>
        </View>
      </Card>

      <View style={styles.statRow}>
        <StatTile number={`${profile.hoursLogged}`} label="Hours logged" />
        <StatTile number={`${profile.planKeptPct}%`} label="Plan kept" />
        <StatTile number={`${profile.bestStreak}`} label="Best streak" />
      </View>

      <Card style={[styles.settingsCard, { marginBottom: 26 }]} padded={false}>
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <Pressable
              key={row.label}
              onPress={row.onPress}
              style={[styles.row, i < rows.length - 1 && styles.rowDivider]}
            >
              <Icon size={19} color={color.ink} />
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {row.value}
              </Text>
              <ChevronRight size={18} color="rgba(32,30,29,0.4)" />
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: {
    marginHorizontal: 14,
    borderRadius: 24,
    overflow: "hidden",
  },
  identityCard: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  name: {
    fontFamily: font.bold,
    fontSize: 21,
    color: color.ink,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 12,
    color: color.mutedText,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: font.bold,
    fontSize: 11,
    color: color.ink,
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 14,
    marginTop: 10,
  },
  settingsCard: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  rowLabel: {
    flex: 1,
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
  },
  rowValue: {
    fontFamily: font.regular,
    fontSize: 11.5,
    color: color.mutedText,
    marginRight: 6,
    maxWidth: 120,
  },
});
