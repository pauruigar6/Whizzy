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
const diasFirebase = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

export default function HomeScreen() {
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [tareas, setTareas] = useState<any[]>([]);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchUserAndGroup = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setNombre(userData.nombre ?? "");
        setAvatarIndex(userData.avatarIndex ?? null);

        if (userData.grupoId) {
          const grupoRef = doc(db, "grupos", userData.grupoId);
          const grupoSnap = await getDoc(grupoRef);

          if (grupoSnap.exists()) {
            const grupoData = grupoSnap.data();
            const dia = grupoData.inicioSemana;
            const index = diasFirebase.findIndex((d) => d === dia);
            if (index !== -1) setSelectedDayIndex(index);
            setTareas(grupoData.tareas ?? []);
          }
        }
      }
    };

    fetchUserAndGroup();
  }, []);

  const handleTareaSeleccion = (tareaId: string) => {
    setTareasSeleccionadas((prev) => ({
      ...prev,
      [tareaId]: !prev[tareaId],
    }));
  };

  const nombreDiaFirebase = diasFirebase[selectedDayIndex];
  const tareasFiltradas = tareas.filter((t) => t.dia === nombreDiaFirebase);

  return (
    <SafeAreaView style={styles.container}>
      
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hola</Text>
          <Text style={styles.brandText}>{nombre} 👋</Text>
          {avatarIndex !== null && (
            <Image
              source={avatarImages[avatarIndex]}
              style={styles.avatarTopRight}
            />
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.calendarScroll}
          >
            <View style={styles.calendar}>
              {diasSemana.map((dia, index) => (
                <TouchableOpacity
                  key={dia}
                  style={[
                    styles.dayItem,
                    selectedDayIndex === index && styles.dayItemSelected,
                  ]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDayIndex === index && { color: "#fff" },
                    ]}
                  >
                    {dia}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.tareasContainer}>
            {tareasFiltradas.length > 0 ? (
              tareasFiltradas.map((tarea) => (
                <TouchableOpacity
                  key={tarea.id}
                  style={styles.tareaItem}
                  onPress={() => handleTareaSeleccion(tarea.id)}
                >
                  <View
                    style={[
                      styles.checkCircle,
                      tareasSeleccionadas[tarea.id] && styles.checkedDone,
                    ]}
                  >
                    {tareasSeleccionadas[tarea.id] && (
                      <View style={styles.checkInner} />
                    )}
                  </View>
                  <Text style={styles.tareaTexto}>{tarea.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "#aaa", fontStyle: "italic" }}>
                No hay tareas para este día.
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Semana Actual</Text>

          <View style={styles.card2}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.image}
            />
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
        </View>
      </ScrollView>
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
  card: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 20,
  },
  calendarScroll: {
    maxHeight: 60,
    marginVertical: 10,
  },
  calendar: {
    flexDirection: "row",
    gap: width * 0.1,
    alignItems: "center",
  },
  dayItem: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
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
  checkedDone: {
    borderColor: "#1f618d",
    backgroundColor: "#d6eaf8",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card2: {
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
