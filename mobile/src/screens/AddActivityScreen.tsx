import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Stepper } from "../components/Stepper";
import { SegmentedControl } from "../components/SegmentedControl";
import { useAppStore } from "../store/useAppStore";
import { Category } from "../types";
import { color, font, radius } from "../theme/tokens";
import { formatHeaderDate } from "../lib/time";

const CATEGORIES: Category[] = ["Study", "Lecture", "Lab", "Clinical"];

export function AddActivityScreen() {
  const navigation = useNavigation<any>();
  const form = useAppStore((s) => s.form);
  const setForm = useAppStore((s) => s.setForm);
  const addActivity = useAppStore((s) => s.addActivity);
  const [showPicker, setShowPicker] = React.useState(false);

  const submit = async () => {
    await addActivity();
    navigation.navigate("Today");
  };

  const cancel = () => {
    navigation.navigate("Today");
  };

  const timeValue = React.useMemo(() => {
    const [h, m] = form.start.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }, [form.start]);

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>New activity</Text>
        <Text style={styles.sub}>
          It lands on {formatHeaderDate(new Date()).split(" · ")[0]} and counts toward your subject goals.
        </Text>
        <View style={styles.rule} />

        <Text style={styles.label}>TITLE</Text>
        <TextInput
          value={form.title}
          onChangeText={(title) => setForm({ title })}
          placeholder="e.g. Renal physiology revision"
          placeholderTextColor={color.mutedText}
          style={styles.input}
          selectionColor={color.accent}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => {
            const selected = form.category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setForm({ category: c })}
                style={[
                  styles.categoryBtn,
                  selected && { backgroundColor: color.ink, borderColor: color.ink },
                ]}
              >
                <Text style={[styles.categoryText, selected && { color: color.surface }]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>STARTS</Text>
        <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
          <Text style={styles.inputText}>{form.start}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={timeValue}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowPicker(Platform.OS === "ios");
              if (selected) {
                const hh = String(selected.getHours()).padStart(2, "0");
                const mm = String(selected.getMinutes()).padStart(2, "0");
                setForm({ start: `${hh}:${mm}` });
              }
            }}
          />
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>DURATION</Text>
        <Stepper value={form.duration} onChange={(duration) => setForm({ duration })} />

        <Text style={[styles.label, { marginTop: 16 }]}>REMIND ME BEFORE</Text>
        <SegmentedControl
          value={form.remind}
          onChange={(remind) => setForm({ remind })}
          options={[
            { label: "5 min", value: 5 },
            { label: "10 min", value: 10 },
            { label: "30 min", value: 30 },
          ]}
        />

        <View style={[styles.rule, { marginTop: 18 }]} />

        <Pressable style={styles.primaryBtn} onPress={submit}>
          <Text style={styles.primaryBtnText}>Add to schedule</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={cancel}>
          <Text style={styles.secondaryBtnText}>Cancel</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 28,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 24,
    color: color.ink,
  },
  sub: {
    marginTop: 6,
    fontFamily: font.regular,
    fontSize: 12,
    color: color.mutedText,
  },
  rule: {
    marginTop: 16,
    height: 1,
    backgroundColor: color.hairline,
  },
  label: {
    marginTop: 18,
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: color.ink,
    textTransform: "uppercase",
  },
  input: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.surface,
    paddingHorizontal: 14,
    justifyContent: "center",
    fontFamily: font.regular,
    fontSize: 14,
    color: color.ink,
  },
  inputText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: color.ink,
  },
  categoryGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    width: "47%",
    minHeight: 44,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.surface,
    justifyContent: "center",
    paddingLeft: 12,
  },
  categoryText: {
    fontFamily: font.bold,
    fontSize: 12.5,
    color: color.ink,
  },
  primaryBtn: {
    marginTop: 18,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    justifyContent: "center",
    paddingLeft: 20,
  },
  primaryBtnText: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.surface,
  },
  secondaryBtn: {
    marginTop: 10,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.ink,
  },
});
