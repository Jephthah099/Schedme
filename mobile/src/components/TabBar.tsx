import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Activity, Calendar, Plus, Target, User, LucideIcon } from "lucide-react-native";
import { color, font, radius, shadow } from "../theme/tokens";

const ICONS: Record<string, LucideIcon> = {
  Progress: Activity,
  Today: Calendar,
  Add: Plus,
  Goals: Target,
  You: User,
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(22, insets.bottom) }, shadow.tabBar]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel?.toString() ?? route.name;
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? Activity;
        const isAdd = route.name === "Add";

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            {focused && !isAdd && <View style={styles.marker} />}
            {isAdd ? (
              <View style={styles.addButton}>
                <Icon size={24} color={color.surface} strokeWidth={2.5} />
              </View>
            ) : (
              <>
                <Icon size={21} color={focused ? color.ink : color.mutedText} strokeWidth={2} />
                <Text style={[styles.label, { color: focused ? color.ink : color.mutedText }]}>
                  {label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: color.surface,
    borderTopLeftRadius: radius.tabBarTop,
    borderTopRightRadius: radius.tabBarTop,
  },
  tab: {
    flex: 1,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  marker: {
    position: "absolute",
    top: 4,
    width: 22,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: color.accent,
  },
  label: {
    marginTop: 4,
    fontFamily: font.bold,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.addButton,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
