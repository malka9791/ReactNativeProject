// navigation/navigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyRepo from "../pages/myRepo";
import ProfilePage from "../pages/Profile";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyProfile">
      <Stack.Screen name="Details" component={MyRepo} />
      <Stack.Screen
        name="MyProfile"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
