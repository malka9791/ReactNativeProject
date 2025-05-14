import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    // בעת טעינת העמוד – טוען ערכים שנשמרו
    const loadSettings = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("darkMode");
        const savedNotifications = await AsyncStorage.getItem("notifications");

        if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");
        if (savedNotifications !== null)
          setNotifications(savedNotifications === "true");
      } catch (error) {
        console.error("  error in fetching storage data", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // שומר כל פעם שמשנים את הערכים
    AsyncStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    AsyncStorage.setItem("notifications", notifications.toString());
  }, [notifications]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
        style={styles.profileHeader}
      >
        <Image
          source={require("../images/icon.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Mali Elkayam</Text>
        <Text style={styles.profileUsername}>m@gmail.com</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Repositories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>64</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.profileContent}>
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>
            Full-stack developer passionate about React Native and open source
            projects. Working on innovative mobile solutions.
          </Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#6a11cb" }}
              thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: "#6a11cb" }}
              thumbColor={notifications ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.passPage}
          onPress={() => navigation.navigate("Details")}
        >
          <Text style={styles.passPageText}>To My GitHub Repositoris</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  profileHeader: {
    padding: 24,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  profileContent: {
    flex: 1,
    padding: 16,
  },
  bioSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  passPage: {
    backgroundColor: "#2575fc",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  passPageText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
