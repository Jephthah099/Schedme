import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabBar } from "../components/TabBar";
import { ProgressScreen } from "../screens/ProgressScreen";
import { TodayScreen } from "../screens/TodayScreen";
import { AddActivityScreen } from "../screens/AddActivityScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export type YouStackParamList = {
  Profile: undefined;
  Notifications: undefined;
};

export type RootTabParamList = {
  Progress: undefined;
  Today: undefined;
  Add: undefined;
  Goals: undefined;
  You: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const YouStack = createNativeStackNavigator<YouStackParamList>();

function YouStackNavigator() {
  return (
    <YouStack.Navigator screenOptions={{ headerShown: false }}>
      <YouStack.Screen name="Profile" component={ProfileScreen} />
      <YouStack.Screen name="Notifications" component={NotificationsScreen} />
    </YouStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Add" component={AddActivityScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="You" component={YouStackNavigator} />
    </Tab.Navigator>
  );
}
