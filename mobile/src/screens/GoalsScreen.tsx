import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus, X } from "lucide-react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { ProgressBarPill } from "../components/ProgressBarPill";
import { useAppStore } from "../store/useAppStore";
import { color, font, radius } from "../theme/tokens";
import { round1 } from "../lib/deriveStats";
import { toISODate } from "../lib/time";

export function GoalsScreen() {
  const streak = useAppStore((s) => s.streak);
  const goals = useAppStore((s) => s.goals);
  const deadlines = useAppStore((s) => s.deadlines);
  const addGoal = useAppStore((s) => s.addGoal);
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const addDeadline = useAppStore((s) => s.addDeadline);
  const deleteDeadline = useAppStore((s) => s.deleteDeadline);

  const missCount = streak.days.filter((d) => !d.kept).length;

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
            const isRecent = i >= streak.days.length - 3 && d.kept;
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
          Last two weeks: {missCount === 0 ? "every day kept." : `${missCount} day${missCount === 1 ? "" : "s"} missed.`}
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
                <View style={styles.goalRowRight}>
                  <Text style={styles.goalHours} numberOfLines={1}>
                    {round1(g.hoursDone)} / {g.hoursGoal} h
                  </Text>
                  <Pressable onPress={() => deleteGoal(g.id)} hitSlop={8}>
                    <X size={14} color={color.mutedText} />
                  </Pressable>
                </View>
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
          {goals.length === 0 && <Text style={styles.emptyText}>No subject goals yet.</Text>}
        </View>
        <AddGoalForm onAdd={addGoal} />
      </Card>

      {/* Deadlines */}
      <Card style={[styles.card, { marginBottom: 26 }]} padded={false}>
        <Text style={[styles.cardTitle, { padding: 18, paddingBottom: 8 }]}>Deadlines</Text>
        {deadlines.length === 0 && (
          <Text style={[styles.emptyText, { paddingHorizontal: 18, paddingBottom: 12 }]}>
            No deadlines yet.
          </Text>
        )}
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
              {!!d.subtitle && <Text style={styles.deadlineSub}>{d.subtitle}</Text>}
            </View>
            <Text
              style={[
                styles.deadlineDays,
                d.daysLeft <= 10 && { color: color.accent700 },
              ]}
            >
              {d.daysLeft} d
            </Text>
            <Pressable onPress={() => deleteDeadline(d.id)} hitSlop={8} style={{ marginLeft: 10 }}>
              <X size={14} color={color.mutedText} />
            </Pressable>
          </View>
        ))}
        <View style={{ padding: 18, paddingTop: deadlines.length ? 4 : 0 }}>
          <AddDeadlineForm onAdd={addDeadline} />
        </View>
      </Card>
    </Screen>
  );
}

function AddGoalForm({ onAdd }: { onAdd: (subject: string, hoursGoal: number) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("8");

  const submit = async () => {
    const parsed = Number(hours);
    if (!subject.trim() || !parsed || parsed <= 0) return;
    await onAdd(subject.trim(), parsed);
    setSubject("");
    setHours("8");
    setOpen(false);
  };

  if (!open) {
    return (
      <Pressable style={styles.addRow} onPress={() => setOpen(true)}>
        <Plus size={16} color={color.accent} />
        <Text style={styles.addRowText}>Add subject goal</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.formWrap}>
      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject (e.g. Cardiology)"
        placeholderTextColor={color.mutedText}
        style={styles.formInput}
      />
      <View style={styles.formRow}>
        <TextInput
          value={hours}
          onChangeText={setHours}
          placeholder="Hours"
          placeholderTextColor={color.mutedText}
          keyboardType="decimal-pad"
          style={[styles.formInput, { flex: 1, marginTop: 0 }]}
        />
        <Pressable style={styles.formPrimaryBtn} onPress={submit}>
          <Text style={styles.formPrimaryBtnText}>Add</Text>
        </Pressable>
        <Pressable style={styles.formCancelBtn} onPress={() => setOpen(false)}>
          <X size={16} color={color.ink} />
        </Pressable>
      </View>
    </View>
  );
}

function AddDeadlineForm({
  onAdd,
}: {
  onAdd: (title: string, subtitle: string, dueDate: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    await onAdd(title.trim(), subtitle.trim(), toISODate(date));
    setTitle("");
    setSubtitle("");
    setDate(new Date());
    setOpen(false);
  };

  if (!open) {
    return (
      <Pressable style={styles.addRow} onPress={() => setOpen(true)}>
        <Plus size={16} color={color.accent} />
        <Text style={styles.addRowText}>Add deadline</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.formWrap}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title (e.g. OSCE cardiovascular station)"
        placeholderTextColor={color.mutedText}
        style={styles.formInput}
      />
      <TextInput
        value={subtitle}
        onChangeText={setSubtitle}
        placeholder="Detail (optional)"
        placeholderTextColor={color.mutedText}
        style={[styles.formInput, { marginTop: 8 }]}
      />
      <View style={styles.formRow}>
        <Pressable style={[styles.formInput, { flex: 1, marginTop: 0, justifyContent: "center" }]} onPress={() => setShowPicker(true)}>
          <Text style={{ fontFamily: font.regular, fontSize: 13, color: color.ink }}>
            {date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          </Text>
        </Pressable>
        <Pressable style={styles.formPrimaryBtn} onPress={submit}>
          <Text style={styles.formPrimaryBtnText}>Add</Text>
        </Pressable>
        <Pressable style={styles.formCancelBtn} onPress={() => setOpen(false)}>
          <X size={16} color={color.ink} />
        </Pressable>
      </View>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowPicker(Platform.OS === "ios");
            if (selected) setDate(selected);
          }}
        />
      )}
    </View>
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
    alignItems: "center",
  },
  goalRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  emptyText: {
    fontFamily: font.regular,
    fontSize: 12,
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
  addRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addRowText: {
    fontFamily: font.bold,
    fontSize: 12.5,
    color: color.accent,
  },
  formWrap: {
    marginTop: 14,
  },
  formInput: {
    marginTop: 8,
    minHeight: 44,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.surface,
    paddingHorizontal: 12,
    fontFamily: font.regular,
    fontSize: 13,
    color: color.ink,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  formPrimaryBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.input,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  formPrimaryBtnText: {
    fontFamily: font.bold,
    fontSize: 12.5,
    color: color.surface,
  },
  formCancelBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
