import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Feather, FontAwesome } from "@expo/vector-icons";

export default function MyRepo() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const scrollViewRef = useRef(null);

  // Fetch repositories
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Filter repositories when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRepos(repos);
    } else {
      const filtered = repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredRepos(filtered);
    }
  }, [searchQuery, repos]);

  const fetchRepositories = () => {
    setLoading(true);
    axios
      .get("http://10.0.2.2:5072/GitHub")
      .then((res) => {
        setRepos(res.data);
        setFilteredRepos(res.data);
      })
      .catch((err) => {
        console.error("Error loading repositories:", err);
        Alert.alert(
          "Error",
          "Failed to load repositories. Please try again later.",
          [{ text: "OK" }]
        );
      })
      .finally(() => setLoading(false));
  };

  const handleRepoPress = (repo) => {
    setSelectedRepo(repo);
    setModalVisible(true);
  };

  const sortByStars = () => {
    const sorted = [...filteredRepos].sort(
      (a, b) => b.stargazersCount - a.stargazersCount
    );
    setFilteredRepos(sorted);
    Alert.alert("Sorted", "Repositories sorted by stars");
  };

  const filterByLanguage = (language) => {
    if (!language) {
      setFilteredRepos(repos);
    } else {
      const filtered = repos.filter((repo) => repo.language === language);
      setFilteredRepos(filtered);
    }
    setShowLanguageFilter(false);
  };

  const getUniqueLanguages = () => {
    const languages = repos
      .map((repo) => repo.language)
      .filter((language) => language !== null);
    return [...new Set(languages)];
  };

  const renderLanguageFilter = () => {
    const languages = getUniqueLanguages();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageFilter}
        onRequestClose={() => setShowLanguageFilter(false)}
      >
        <View style={styles.languageFilterContainer}>
          <View
            style={[
              styles.languageFilterContent,
              isDarkMode && styles.darkModeBackground,
            ]}
          >
            <View style={styles.languageFilterHeader}>
              <Text
                style={[
                  styles.languageFilterTitle,
                  isDarkMode && styles.darkModeText,
                ]}
              >
                Filter by Language
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageFilter(false)}>
                <Feather
                  name="x"
                  size={22}
                  color="red"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                style={styles.languageItem}
                onPress={() => filterByLanguage(null)}
              >
                <Text
                  style={[
                    styles.languageText,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  All Languages
                </Text>
              </TouchableOpacity>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={styles.languageItem}
                  onPress={() => filterByLanguage(language)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      isDarkMode && styles.darkModeText,
                    ]}
                  >
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderRepoModal = () => {
    if (!selectedRepo) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              isDarkMode && styles.darkModeBackground,
            ]}
          >
            <ScrollView>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Image
                    source={{ uri: selectedRepo.owner?.avatarUrl }}
                    style={styles.modalAvatar}
                  />
                  <Text
                    style={[
                      styles.modalTitle,
                      isDarkMode && styles.darkModeText,
                    ]}
                  >
                    {selectedRepo.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather
                    name="x"
                    size={22}
                    color="red"
                    a
                    style={{ marginRight: 4 }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalInfoContainer}>
                <Text
                  style={[
                    styles.modalInfoLabel,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  Owner:
                </Text>
                <Text
                  style={[
                    styles.modalInfoValue,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  {selectedRepo.owner?.login}
                </Text>
              </View>

              <View style={styles.modalInfoContainer}>
                <Text
                  style={[
                    styles.modalInfoLabel,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  Language:
                </Text>
                <Text
                  style={[
                    styles.modalInfoValue,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  {selectedRepo.language || "Not specified"}
                </Text>
              </View>

              <View style={styles.modalInfoContainer}>
                <Text
                  style={[
                    styles.modalInfoLabel,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  Description:
                </Text>
                <Text
                  style={[
                    styles.modalInfoValue,
                    isDarkMode && styles.darkModeText,
                  ]}
                >
                  {selectedRepo.description || "No description available"}
                </Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Feather
                    name="star"
                    size={16}
                    color="gold"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[styles.statText, isDarkMode && styles.darkModeText]}
                  >
                    {selectedRepo.stargazersCount || 0}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome name="code-fork" size={16} color="gold" />
                  <Text
                    style={[styles.statText, isDarkMode && styles.darkModeText]}
                  >
                    {selectedRepo.forksCount || 0}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  Alert.alert(
                    "Open Repository",
                    `Would open ${selectedRepo.htmlUrl} in browser`
                  );
                }}
              >
                <Text style={styles.openButtonText}>Open in Browser</Text>
                <Feather
                  name="external-link"
                  size={16}
                  color="gold"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRepoPress(item)}>
      <View style={[styles.card, isDarkMode && styles.darkModeCard]}>
        <View style={styles.header}>
          <Image
            source={{ uri: item.owner?.avatarUrl }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.name, isDarkMode && styles.darkModeText]}>
              {item.name}
            </Text>
            <Text style={[styles.language, isDarkMode && styles.darkModeText]}>
              {item.language || "No language"}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Feather
              name="star"
              size={16}
              color="gold"
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statText, isDarkMode && styles.darkModeText]}>
              {item.stargazersCount || 0}
            </Text>
          </View>
        </View>
        <Text style={[styles.description, isDarkMode && styles.darkModeText]}>
          {item.description || "No description"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, isDarkMode && styles.darkModeText]}>
        No repositories found
      </Text>
      <Pressable style={styles.refreshButton} onPress={fetchRepositories}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require("../images/bg.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        imageStyle={{ opacity: 1 }}
      >
        <SafeAreaView
          style={[styles.container, isDarkMode && styles.darkModeContainer]}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.title, isDarkMode && styles.darkModeText]}>
              GitHub Repositories
            </Text>
            <View style={styles.themeToggle}>
              <Text
                style={[
                  styles.themeToggleText,
                  isDarkMode && styles.darkModeText,
                ]}
              >
                {isDarkMode ? "Dark" : "Light"}
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.searchContainer}>
              <View
                style={[
                  styles.searchInputContainer,
                  isDarkMode && styles.darkModeInput,
                ]}
              >
                <Feather
                  name="search"
                  size={16}
                  color="gold"
                  style={{ marginRight: 4 }}
                />
                <TextInput
                  style={[
                    styles.searchInput,
                    isDarkMode && styles.darkModeText,
                  ]}
                  placeholder="Search repositories..."
                  placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  isDarkMode && styles.darkModeButton,
                ]}
                onPress={() => setShowLanguageFilter(true)}
              >
                <Feather
                  name="filter"
                  size={16}
                  color="gold"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    isDarkMode && styles.darkModeButtonText,
                  ]}
                >
                  Filter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  isDarkMode && styles.darkModeButton,
                ]}
                onPress={sortByStars}
              >
                <Feather
                  name="star"
                  size={16}
                  color="gold"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    isDarkMode && styles.darkModeButtonText,
                  ]}
                >
                  Sort by Stars
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color={isDarkMode ? "#81b0ff" : "#e93345"}
                style={styles.loader}
              />
            ) : (
              <FlatList
                data={filteredRepos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={renderEmptyList}
                onRefresh={fetchRepositories}
                refreshing={loading}
              />
            )}
          </KeyboardAvoidingView>

          {renderRepoModal()}
          {renderLanguageFilter()}
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkModeContainer: {
    backgroundColor: "#121212",
  },
  darkModeBackground: {
    backgroundColor: "#1e1e1e",
  },
  darkModeCard: {
    backgroundColor: "#2a2a2a",
  },
  darkModeText: {
    color: "#fff",
  },
  darkModeInput: {
    backgroundColor: "#333",
    borderColor: "#444",
  },
  darkModeButton: {
    backgroundColor: "#333",
  },
  darkModeButtonText: {
    color: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggleText: {
    marginRight: 8,
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
    margin: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  language: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: "#e93345",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  modalInfoContainer: {
    marginBottom: 12,
  },
  modalInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  openButton: {
    backgroundColor: "#e93345",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 8,
  },
  languageFilterContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  languageFilterContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "60%",
  },
  languageFilterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  languageFilterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  languageItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
});
