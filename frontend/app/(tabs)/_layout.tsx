import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"; // default

          if (route.name === "home") iconName = "home";
          else if (route.name === "announcements") iconName = "megaphone";
          else if (route.name === "mentors") iconName = "people";
          else if (route.name === "login") iconName = "log-in";
          else if (route.name === "register") iconName = "person-add";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}