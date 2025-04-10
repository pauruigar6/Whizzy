import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  ToastAndroid,
  SectionList,
  FlatList,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

// Datos de tareas (lista entera de tareas) según tu SelectTask
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
  {
    title: "Salón",
    data: [{ id: "7", title: "Quitar la mesa", points: 10 }],
  },
  {
    title: "Baño",
    data: [{ id: "8", title: "Recoger lavavajillas", points: 15 }],
  },
  {
    title: "Pasillo",
    data: [{ id: "9", title: "Barrido", points: 10 }],
  },
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

// Array de días para programar las tareas
const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function TaskSelectionScreen() {
  // Datos de usuario para el header (reutilizando el estilo de HomeScreen)
  const [avatarIndex, setAvatarIndex] = useState(null);
  const [nombre, setNombre] = useState("");
  // Datos para la selección de tareas (se utilizarán los arrays locales de simpleSections y detailedTasks)
  const [tareas, setTareas] = useState([]); // Se mantiene esta variable en caso de que necesites la lista de "tareas" obtenidas de Firestore
  // En este ejemplo se utiliza un array para almacenar los IDs de las tareas seleccionadas
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

  // Nuevos estados para el toggle entre modo "simple" y "detallado", mensaje de error y día seleccionado
  const [mode, setMode] = useState("simple");
  const [error, setError] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario para el header
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setNombre(userData.nombre ?? "");
        setAvatarIndex(userData.avatarIndex ?? null);
      }
    };

    // Obtener la lista de tareas de Firestore (se mantiene sin modificar)
    const fetchTareas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tareas"));
        const listaTareas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTareas(listaTareas);
      } catch (error) {
        console.error("Error al obtener las tareas: ", error);
      }
    };

    fetchUserData();
    fetchTareas();
  }, []);

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Whizzy", message);
    }
  };

  // Alternar la selección de una tarea (se almacena el ID de la tarea en un array)
  const toggleTask = (id) => {
    setTareasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Acción al pulsar "Siguiente" para enviar las tareas seleccionadas
  const handleSubmit = async () => {
    if (tareasSeleccionadas.length === 0) {
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

      const grupoRef = doc(db, "grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);
      if (!grupoSnap.exists()) return;

      // Usar el día seleccionado en nuestro picker (por ejemplo, "Lunes")
      const selectedDay = daysOfWeek[selectedDayIndex];

      // Combinar ambas listas de tareas locales
      const allTasks = [
        ...simpleSections.flatMap((section) => section.data),
        ...detailedTasks,
      ];

      // Filtrar las tareas seleccionadas y asignarles el día elegido
      const selected = allTasks
        .filter((task) => tareasSeleccionadas.includes(task.id))
        .map((task) => ({ ...task, dia: selectedDay }));

      await updateDoc(grupoRef, {
        tareas: selected,
      });

      router.replace("/(tabs)/HomeScreen");
    } catch (error) {
      console.error("Error actualizando grupo con tareas:", error);
    }
  };

  // Función para renderizar cada ítem en el modo simple (SectionList)
  const renderSimpleTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => toggleTask(item.id)}
    >
      <View style={styles.circle}>
        {tareasSeleccionadas.includes(item.id) && (
          <View style={styles.filledCircle} />
        )}
      </View>
      <Text style={styles.taskText}>{item.title}</Text>
      <View
        style={[
          styles.pointsContainer,
          tareasSeleccionadas.includes(item.id) &&
            styles.pointsContainerSelected,
        ]}
      >
        <Text
          style={[
            styles.points,
            tareasSeleccionadas.includes(item.id) && styles.pointsSelected,
          ]}
        >
          {item.points} puntos
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Función para renderizar cada ítem en el modo detallado (FlatList)
  const renderDetailedTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => toggleTask(item.id)}
    >
      <View style={styles.circle}>
        {tareasSeleccionadas.includes(item.id) && (
          <View style={styles.filledCircle} />
        )}
      </View>
      <Text style={styles.taskText}>{item.title}</Text>
      <View
        style={[
          styles.pointsContainer,
          tareasSeleccionadas.includes(item.id) &&
            styles.pointsContainerSelected,
        ]}
      >
        <Text
          style={[
            styles.points,
            tareasSeleccionadas.includes(item.id) && styles.pointsSelected,
          ]}
        >
          {item.points} puntos
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header: igual que en HomeScreen */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hola</Text>
        <Text style={styles.brandText}>{nombre} 👋</Text>
        {avatarIndex !== null && (
          <TouchableOpacity
            style={styles.avatarTouch}
            onPress={() => router.push("/screens/ProfileScreen")}
          >
            <Image
              source={avatarImages[avatarIndex]}
              style={styles.avatarTopRight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido principal */}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
        <Text style={styles.title}>Lista de tareas </Text>

        {/* Toggle de modo: Simple / Detallado */}
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

        {/* Lista de Tareas */}
        <View style={styles.taskList}>
          {mode === "simple" ? (
            <SectionList
              sections={simpleSections}
              keyExtractor={(item) => item.id}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
              renderItem={renderSimpleTaskItem}
            />
          ) : (
            <FlatList
              data={detailedTasks}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={renderDetailedTaskItem}
            />
          )}
        </View>

        {/* Selección del día para programar las tareas */}
        <Text style={styles.dayTitle}>
          Selecciona un día para programar las tareas:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dayContainer}
        >
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayItem,
                selectedDayIndex === index && styles.dayItemSelected,
              ]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text
                style={
                  selectedDayIndex === index
                    ? styles.dayTextSelected
                    : styles.dayText
                }
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      {/* El Tabbar se conserva si está definido en la estructura del router o en un layout global */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
    justifyContent: "flex-start",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: height * 0.06,
    marginBottom: height * 0.06,
    position: "relative",
  },
  welcomeText: {
    fontSize: 22,
    color: "#1f618d",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f618d",
  },
  avatarTouch: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  avatarTopRight: {
    width: 75,
    height: 75,
    borderRadius: 25,
    marginTop: 5,
    marginRight: 5,
    resizeMode: "contain",
  },
  card: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 20,
  },
  // Contenido
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f618d",
    marginBottom: 10,
    textAlign: "justify",
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
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "justify",
  },
  dayContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dayItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginRight: 10,
  },
  dayItemSelected: {
    backgroundColor: "#1f618d",
  },
  dayText: {
    color: "#888",
    fontWeight: "600",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1f618d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
