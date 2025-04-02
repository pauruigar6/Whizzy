import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation"; // usa tu alias o corrige ruta si no usas alias

// Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import SelectGroupScreen from "../screens/SelectGroupScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import SelectTaskScreen from "../screens/SelectTaskScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator<RootStackParamList>(); // 👈 tipado correcto

const Tabs = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
      id={undefined}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="SelectGroup" component={SelectGroupScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="SelectTask" component={SelectTaskScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default Tabs;
