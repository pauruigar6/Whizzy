import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  SectionList,
  Dimensions,
  FlatList,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const simpleSections = [
  {
    title: "Cocina",
    data: [
      { id: "1", title: "Fregar los platos", points: 15 },
      { id: "2", title: "Limpiar la cocina", points: 25 },
      { id: "3", title: "Poner la mesa", points: 10 },
      { id: "4", title: "Poner lavavajillas", points: 10 },
      { id: "5", title: "Preparar una comida", points: 35 },
    ],
  },
  {
    title: "Habitación",
    data: [{ id: "6", title: "Doblar y guardar", points: 15 }],
  },
  { title: "Salón", data: [{ id: "7", title: "Quitar la mesa", points: 10 }] },
  {
    title: "Baño",
    data: [{ id: "8", title: "Recoger lavavajillas", points: 15 }],
  },
  { title: "Pasillo", data: [{ id: "9", title: "Barrido", points: 10 }] },
  {
    title: "Terraza",
    data: [{ id: "10", title: "Regar plantas", points: 20 }],
  },
];

const detailedTasks = [
  { id: "11", title: "Fregar los platos", points: 15 },
  { id: "12", title: "Limpiar el refrigerador", points: 25 },
  { id: "13", title: "Limpiar horno", points: 30 },
  { id: "14", title: "Limpiar la mesa", points: 15 },
  { id: "15", title: "Limpiar microondas", points: 20 },
  { id: "16", title: "Limpiar muebles cocina", points: 25 },
  { id: "17", title: "Limpiar nevera", points: 30 },
];

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

export default function TaskSelectScreen({ navigation }) {
  const [mode, setMode] = useState("simple");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [avatarIndex, setAvatarIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAvatarIndex(data.avatarIndex ?? null);
        }
      } catch (error) {
        console.error("Error al obtener avatar del usuario:", error);
      }
    };
    fetchAvatar();
  }, []);

  const toggleTask = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedTasks.length === 0) {
      setError("Selecciona al menos una tarea antes de continuar.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const grupoId = userSnap.data().grupoId;

      if (!grupoId) return;

      const allTasks = [
        ...simpleSections.flatMap((s) => s.data),
        ...detailedTasks,
      ];
      const selected = allTasks.filter((task) =>
        selectedTasks.includes(task.id)
      );

      await updateDoc(doc(db, "grupos", grupoId), {
        tareas: selected,
        codigoInvitacion: Math.random().toString(36).substring(2, 8),
      });

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error guardando tareas:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.brandText}>Whizzy</Text>
          {avatarIndex !== null && (
            <Image
              source={avatarImages[avatarIndex]}
              style={styles.avatarTopRight}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            Escoge algunas tareas de la siguiente lista para empezar.
          </Text>
          <Text style={styles.description}>
            No te preocupes, podrás añadir nuevas tareas o actualizarlas en
            cualquier momento en tu equipo.
          </Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === "simple" && styles.tabSelected]}
              onPress={() => setMode("simple")}
            >
              <Text
                style={
                  mode === "simple" ? styles.tabTextSelected : styles.tabText
                }
              >
                Simple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "detailed" && styles.tabSelected]}
              onPress={() => setMode("detailed")}
            >
              <Text
                style={
                  mode === "detailed" ? styles.tabTextSelected : styles.tabText
                }
              >
                Detallado
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.taskList}>
            {mode === "simple" ? (
              <SectionList
                sections={simpleSections}
                keyExtractor={(item) => item.id}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.taskItem}
                    onPress={() => toggleTask(item.id)}
                  >
                    <View style={styles.circle}>
                      {selectedTasks.includes(item.id) && (
                        <View style={styles.filledCircle} />
                      )}
                    </View>
                    <Text style={styles.taskText}>{item.title}</Text>
                    <View
                      style={[
                        styles.pointsContainer,
                        selectedTasks.includes(item.id) &&
                          styles.pointsContainerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.points,
                          selectedTasks.includes(item.id) &&
                            styles.pointsSelected,
                        ]}
                      >
                        {item.points} puntos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={detailedTasks}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.taskItem}
                    onPress={() => toggleTask(item.id)}
                  >
                    <View style={styles.circle}>
                      {selectedTasks.includes(item.id) && (
                        <View style={styles.filledCircle} />
                      )}
                    </View>
                    <Text style={styles.taskText}>{item.title}</Text>
                    <View
                      style={[
                        styles.pointsContainer,
                        selectedTasks.includes(item.id) &&
                          styles.pointsContainerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.points,
                          selectedTasks.includes(item.id) &&
                            styles.pointsSelected,
                        ]}
                      >
                        {item.points} puntos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {!!error && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              {error}
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
  },
  header: {
    marginTop: height * 0.06,
    marginBottom: height * 0.06,
    position: "relative",
  },
  welcomeText: { fontSize: 22, color: "#1f618d" },
  brandText: { fontSize: 28, fontWeight: "bold", color: "#1f618d" },
  avatarTopRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 100,
    height: 100,
    borderRadius: 25,
    marginTop: 5,
    marginRight: 5,
    resizeMode: "contain",
  },
  card: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 15,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabSelected: { backgroundColor: "#fff" },
  tabText: { color: "#888", fontWeight: "600" },
  tabTextSelected: { color: "#1f618d", fontWeight: "bold" },
  taskList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 20,
    height: height * 0.4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f618d",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#1f618d",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  filledCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1f618d",
  },
  taskText: { flex: 1, fontSize: 16, color: "#333" },
  pointsContainer: {
    backgroundColor: "#ebf5fb",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsContainerSelected: { backgroundColor: "#1f618d" },
  points: { fontSize: 14, fontWeight: "bold", color: "#1f618d" },
  pointsSelected: { color: "#fff" },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
