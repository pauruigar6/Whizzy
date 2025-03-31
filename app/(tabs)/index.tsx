import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import HomeScreen from "../screens/WelcomeScreen";
import SelectGroupScreen from "../screens/SelectGroupScreen";

const Stack = createStackNavigator();

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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectGroup" component={SelectGroupScreen} />
    </Stack.Navigator>
  );
};

export default Tabs;
