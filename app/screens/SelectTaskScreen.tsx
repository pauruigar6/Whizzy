import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const simpleTasks = [
  { id: "1", title: "Fregar los platos", points: 15 },
  { id: "2", title: "Limpiar la cocina", points: 25 },
  { id: "3", title: "Poner la mesa", points: 10 },
  { id: "4", title: "Poner lavavajillas", points: 10 },
  { id: "5", title: "Preparar una comida", points: 35 },
  { id: "6", title: "Quitar la mesa", points: 10 },
  { id: "7", title: "Recoger lavavajillas", points: 15 },
];

const detailedTasks = [
  { id: "8", title: "Fregar los platos", points: 15 },
  { id: "9", title: "Limpiar el refrigerador", points: 25 },
  { id: "10", title: "Limpiar horno", points: 30 },
  { id: "11", title: "Limpiar la mesa", points: 15 },
  { id: "12", title: "Limpiar microondas", points: 20 },
  { id: "13", title: "Limpiar muebles cocina", points: 25 },
  { id: "14", title: "Limpiar nevera", points: 30 },
];

export default function TaskSelectScreen({ navigation }: { navigation: any }) {
  const [mode, setMode] = useState<"simple" | "detailed">("simple");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const currentTasks = mode === "simple" ? simpleTasks : detailedTasks;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.brandText}>Whizzy</Text>
      </View>

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image}
      />

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
          <Text style={mode === "simple" ? styles.tabTextSelected : styles.tabText}>
            Simple
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "detailed" && styles.tabSelected]}
          onPress={() => setMode("detailed")}
        >
          <Text style={mode === "detailed" ? styles.tabTextSelected : styles.tabText}>
            Detallado
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskList}>
        <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
          {currentTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => toggleTask(task.id)}
            >
              <View style={styles.circle}>
                {selectedTasks.includes(task.id) && <View style={styles.filledCircle} />}
              </View>
              <Text style={styles.taskText}>{task.title}</Text>
              <View style={styles.pointsContainer}>
                <Text style={styles.points}>{task.points} puntos</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { marginTop: 40 },
  welcomeText: { fontSize: 22, color: "#1f618d" },
  brandText: { fontSize: 28, fontWeight: "bold", color: "#1f618d" },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
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
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabSelected: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#888",
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "#1f618d",
    fontWeight: "bold",
  },
  taskList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 20,
    flex: 1, // ← para que ocupe todo el espacio disponible restante
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
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  pointsContainer: {
    backgroundColor: "#ebf5fb",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f618d",
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
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
