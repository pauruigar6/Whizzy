import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const diasSemana = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

const tareasPorDia = {
  0: [{ id: "1", titulo: "Tarea Domingo 1" }, { id: "2", titulo: "Tarea Domingo 2" }],
  1: [{ id: "3", titulo: "Tarea Lunes 1" }, { id: "4", titulo: "Tarea Lunes 2" }],
  2: [{ id: "5", titulo: "Tarea Martes 1" }, { id: "6", titulo: "Tarea Martes 2" }],
  3: [{ id: "7", titulo: "Tarea Miércoles 1" }, { id: "8", titulo: "Tarea Miércoles 2" }],
  4: [{ id: "9", titulo: "Tarea Jueves 1" }, { id: "10", titulo: "Tarea Jueves 2" }],
  5: [{ id: "11", titulo: "Tarea Viernes 1" }, { id: "12", titulo: "Tarea Viernes 2" }],
  6: [{ id: "13", titulo: "Tarea Sábado 1" }, { id: "14", titulo: "Tarea Sábado 2" }],
};

export default function HomeScreen() {
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay() % 7);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setNombre(data.nombre ?? "");
        setAvatarIndex(data.avatarIndex ?? null);
      }
    };
    fetchUser();
  }, []);

  const handleTareaSeleccion = (tareaId: string) => {
    setTareasSeleccionadas((prev) => ({
      ...prev,
      [tareaId]: !prev[tareaId],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.brandText}>{nombre} 👋</Text>
          {avatarIndex !== null && (
            <Image source={avatarImages[avatarIndex]} style={styles.avatarTopRight} />
          )}
        </View>

        <View style={styles.calendar}>
          {diasSemana.map((dia, index) => (
            <TouchableOpacity
              key={dia}
              style={[styles.dayItem, selectedDayIndex === index && styles.dayItemSelected]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text style={[styles.dayText, selectedDayIndex === index && { color: "#fff" }]}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tareasContainer}>
          {tareasPorDia[selectedDayIndex]?.map((tarea) => (
            <TouchableOpacity
              key={tarea.id}
              style={styles.tareaItem}
              onPress={() => handleTareaSeleccion(tarea.id)}
            >
              <View style={styles.checkCircle}>
                {tareasSeleccionadas[tarea.id] && <View style={styles.checkInner} />}
              </View>
              <Text style={styles.tareaTexto}>{tarea.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.avatarContainer}>
          <Image source={require("../../assets/images/logo.png")} style={styles.avatarDino} />
        </View>

        <Text style={styles.sectionTitle}>Semana Actual</Text>

        <View style={styles.card}>
          <Image source={require("../../assets/images/logo.png")} style={styles.image} />
          <View style={styles.taskInfo}>
            <Text style={styles.taskNumber}>5</Text>
            <Text style={styles.taskLabel}>Quedan</Text>
            <Text style={styles.taskNumber}>0</Text>
            <Text style={styles.taskLabel}>Hechas</Text>
            <Text style={styles.taskNumber}>0</Text>
            <Text style={styles.taskLabel}>Retraso</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Validar Tarea</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
    justifyContent: "flex-start",
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
    width: 75,
    height: 75,
    borderRadius: 25,
    marginTop: 5,
    marginRight: 5,
    resizeMode: "contain",
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  dayItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  dayItemSelected: {
    backgroundColor: "#1f618d",
  },
  dayText: {
    color: "#333",
    fontWeight: "bold",
  },
  tareasContainer: {
    marginBottom: 20,
  },
  tareaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1f618d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1f618d",
  },
  tareaTexto: {
    fontSize: 16,
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarDino: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  taskInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  taskNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f618d",
    textAlign: "center",
  },
  taskLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f7c948",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
