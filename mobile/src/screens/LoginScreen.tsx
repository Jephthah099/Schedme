import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import { color, font, radius } from "../theme/tokens";

export function LoginScreen({ navigation }: any) {
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch {
      // error is surfaced via the store's `error` field
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.wordmark}>SCHEDME</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Log in to your study plan.</Text>

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={color.mutedText}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          style={styles.input}
          selectionColor={color.accent}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>PASSWORD</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={color.mutedText}
          secureTextEntry
          style={styles.input}
          selectionColor={color.accent}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
          onPress={submit}
          disabled={submitting || !email || !password}
        >
          {submitting ? (
            <ActivityIndicator color={color.surface} />
          ) : (
            <Text style={styles.primaryBtnText}>Log in</Text>
          )}
        </Pressable>

        <Pressable style={styles.linkRow} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkAccent}>Sign up</Text></Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.ground,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  wordmark: {
    fontFamily: font.bold,
    fontSize: 12,
    letterSpacing: 2.4,
    color: color.ink,
  },
  title: {
    marginTop: 14,
    fontFamily: font.bold,
    fontSize: 28,
    color: color.ink,
  },
  sub: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 13,
    color: color.mutedText,
  },
  label: {
    marginTop: 24,
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: color.ink,
    textTransform: "uppercase",
  },
  input: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: color.softBorder,
    backgroundColor: color.surface,
    paddingHorizontal: 14,
    fontFamily: font.regular,
    fontSize: 14,
    color: color.ink,
  },
  error: {
    marginTop: 14,
    fontFamily: font.semibold,
    fontSize: 12.5,
    color: color.accent700,
  },
  primaryBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontFamily: font.bold,
    fontSize: 14,
    color: color.surface,
  },
  linkRow: {
    marginTop: 18,
    alignItems: "center",
  },
  linkText: {
    fontFamily: font.regular,
    fontSize: 13,
    color: color.mutedText,
  },
  linkAccent: {
    fontFamily: font.bold,
    color: color.accent,
  },
});
