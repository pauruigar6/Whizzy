import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* index redirige a Welcome */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* stack sin tab bar */}
      <Stack.Screen name="screens/WelcomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SignupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/ProfileSetupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SelectGroupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/CreateGroupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SelectTaskScreen" options={{ headerShown: false }} />

      {/* el layout de tabs entero */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
