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
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          headerShown: true,
          headerStyle: { backgroundColor: '#4a90e2' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="mentors"
        options={{
          title: "MENTORS",
          headerShown: true,
          headerStyle: { backgroundColor: '#4a90e2' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "ANNOUNCEMENTS",
          headerShown: true,
          headerStyle: { backgroundColor: '#4a90e2' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}