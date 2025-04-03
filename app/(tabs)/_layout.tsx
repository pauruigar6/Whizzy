import { Tabs } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#1f618d",
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TasksScreen"
        options={{
          title: "Tareas",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="checkmark.circle.fill" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="PointsScreen"
        options={{
          title: "Puntos",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="star.fill" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="gearshape.fill" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 20,
    backgroundColor: "1f618d",
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 20,
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eee",
  },
});
