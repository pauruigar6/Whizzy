import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
const { width, height } = Dimensions.get("window");

const diasSemana = [
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

export default function CreateGroupScreen({ navigation }: { navigation: any }) {
  const [selectedDay, setSelectedDay] = useState<string>("lunes");
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null); // ✅ Nuevo estado

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

  const handleSaveDay = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const usuarioRef = doc(db, "usuarios", user.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (!usuarioSnap.exists()) {
        return Alert.alert("Error", "No se encontró el usuario.");
      }

      const grupoId = usuarioSnap.data().grupoId;
      if (!grupoId) {
        return Alert.alert("Error", "No estás en un grupo.");
      }

      const grupoRef = doc(db, "grupos", grupoId);
      await updateDoc(grupoRef, {
        inicioSemana: selectedDay,
      });

      navigation.navigate("SelectTask");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.brandText}>Whizzy</Text>
          {avatarIndex !== null && (
            <Image source={avatarImages[avatarIndex]} style={styles.avatarTopRight} />
          )}
        </View>
 <View style={styles.card}>
        <Text style={styles.title}>Elija el día de inicio de la competición</Text>
        <Text style={styles.description}>
          Una vez finalizada la semana, las tareas de la semana anterior ya no se pueden editar.
        </Text>
        <Text style={styles.note}>
          No te preocupes, podrás cambiar este día más adelante en los ajustes
        </Text>

        <View style={styles.dayList}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={styles.dayItem}
              onPress={() => setSelectedDay(dia)}
            >
              <View style={styles.circle}>
                {selectedDay === dia && <View style={styles.filledCircle} />}
              </View>
              <Text style={styles.dayText}>{dia}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveDay}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
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
  note: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 15,
  },
  dayList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
