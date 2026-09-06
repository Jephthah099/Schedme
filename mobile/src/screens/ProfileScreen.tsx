import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ChevronRight, Bell, Clock, Calendar, Download, LogOut, Pencil, Check } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { StatTile } from "../components/StatTile";
import { PhotoSlot } from "../components/PhotoSlot";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { color, font, radius } from "../theme/tokens";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const profile = useAppStore((s) => s.profile);
  const toggles = useAppStore((s) => s.toggles);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? "");
  const [subtitle, setSubtitle] = useState(profile?.subtitle ?? "");

  const onCount = toggles.filter((t) => t.enabled).length;

  if (!profile) return <Screen>{null}</Screen>;

  const startEditing = () => {
    setName(profile.name);
    setSubtitle(profile.subtitle);
    setEditing(true);
  };
  const saveEditing = async () => {
    await updateProfile({ name: name.trim() || profile.name, subtitle: subtitle.trim() });
    setEditing(false);
  };

  const adjustTarget = (delta: number) => {
    const next = Math.max(1, Math.min(16, Math.round((profile.dailyTargetH + delta) * 2) / 2));
    updateProfile({ dailyTargetH: next });
  };

  const rows = [
    {
      icon: Bell,
      label: "Notifications",
      value: `${onCount} of ${toggles.length} on`,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: Calendar,
      label: "Timetable import",
      value: "Not connected",
      onPress: () => {},
    },
    {
      icon: Download,
      label: "Export study log",
      value: "CSV",
      onPress: () => {},
    },
  ];

  return (
    <Screen>
      <PhotoSlot height={168} label="Profile" style={styles.photo} />

      <Card style={styles.identityCard}>
        {editing ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={color.mutedText}
              style={styles.editInput}
            />
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="e.g. MB ChB Year 3 · Clinical rotations"
              placeholderTextColor={color.mutedText}
              style={[styles.editInput, { marginTop: 8 }]}
            />
            <Pressable style={styles.saveBtn} onPress={saveEditing}>
              <Check size={16} color={color.surface} />
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.identityRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{profile.name}</Text>
                {!!profile.subtitle && <Text style={styles.subtitle}>{profile.subtitle}</Text>}
              </View>
              <Pressable onPress={startEditing} hitSlop={8}>
                <Pencil size={16} color={color.mutedText} />
              </Pressable>
            </View>
          </>
        )}
      </Card>

      <View style={styles.statRow}>
        <StatTile number={`${profile.hoursLogged}`} label="Hours logged" />
        <StatTile number={`${profile.planKeptPct}%`} label="Plan kept" />
        <StatTile number={`${profile.bestStreak}`} label="Best streak" />
      </View>

      <Card style={styles.targetCard}>
        <View style={{ flex: 1 }}>
          <View style={styles.targetLabelRow}>
            <Clock size={18} color={color.ink} />
            <Text style={styles.targetLabel}>Daily study target</Text>
          </View>
        </View>
        <View style={styles.targetStepper}>
          <Pressable style={styles.targetBtn} onPress={() => adjustTarget(-0.5)} hitSlop={6}>
            <Text style={styles.targetBtnText}>−</Text>
          </Pressable>
          <Text style={styles.targetValue}>{profile.dailyTargetH}h</Text>
          <Pressable style={styles.targetBtn} onPress={() => adjustTarget(0.5)} hitSlop={6}>
            <Text style={styles.targetBtnText}>+</Text>
          </Pressable>
        </View>
      </Card>

      <Card style={styles.settingsCard} padded={false}>
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

      <Pressable style={[styles.logoutBtn, { marginBottom: 26 }]} onPress={logout}>
        <LogOut size={17} color={color.accent700} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
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
  identityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
  editInput: {
    minHeight: 44,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.ground,
    paddingHorizontal: 12,
    fontFamily: font.regular,
    fontSize: 14,
    color: color.ink,
  },
  saveBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
  },
  saveBtnText: {
    fontFamily: font.bold,
    fontSize: 12.5,
    color: color.surface,
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 14,
    marginTop: 10,
  },
  targetCard: {
    marginHorizontal: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  targetLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetLabel: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
  },
  targetStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  targetBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  targetBtnText: {
    fontFamily: font.bold,
    fontSize: 16,
    color: color.ink,
  },
  targetValue: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
    minWidth: 32,
    textAlign: "center",
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
  logoutBtn: {
    marginHorizontal: 14,
    marginTop: 10,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontFamily: font.bold,
    fontSize: 13.5,
    color: color.accent700,
  },
});
