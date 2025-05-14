import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProfilePage from "./pages/Profile";
import 'react-native-gesture-handler'
import MyRepo from "./pages/myRepo";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/navigation";



export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
        {/* <MyRepo></MyRepo> */}
        {/* <ProfilePage></ProfilePage> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
