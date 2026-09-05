import { useNavigation } from "@react-navigation/native";

export function useGoToNotifications() {
  const navigation = useNavigation<any>();
  return () => navigation.navigate("You", { screen: "Notifications" });
}
