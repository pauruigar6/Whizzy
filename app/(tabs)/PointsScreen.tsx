import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { height } = Dimensions.get("window");

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

// Estado emocional según los puntos
const getEstado = (puntos: number) => {
  if (puntos >= 80) return { label: "Feliz", color: "#d4efdf" };
  if (puntos >= 30) return { label: "Dudoso", color: "#fcf3cf" };
  return { label: "Triste", color: "#f5b7b1" };
};

export default function PointsScreen() {
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [ranking, setRanking] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      setNombre(userData.nombre ?? "");
      setAvatarIndex(userData.avatarIndex ?? null);

      const grupoId = userData.grupoId;
      if (!grupoId) return;

      const grupoRef = doc(db, "grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);
      if (!grupoSnap.exists()) return;

      const grupoData = grupoSnap.data();
      const miembros = grupoData.miembros || [];

      const miembrosData: any[] = [];

      for (const uid of miembros) {
        const usuarioRef = doc(db, "usuarios", uid);
        const usuarioSnap = await getDoc(usuarioRef);
        if (!usuarioSnap.exists()) continue;

        const usuario = usuarioSnap.data();
        miembrosData.push({
          uid,
          nombre: usuario.nombre,
          avatarIndex: usuario.avatarIndex ?? 0,
          puntos: 0, // inicializamos en 0
        });
      }

      setRanking(miembrosData);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        <Text style={styles.title}>Puntos de la semana</Text>

        {ranking.map((miembro, index) => {
          const estado = getEstado(miembro.puntos);
          return (
            <View
              key={miembro.uid || index}
              style={[styles.memberCard, { backgroundColor: estado.color }]}
            >
              <View style={styles.memberLeft}>
                <Image
                  source={avatarImages[miembro.avatarIndex]}
                  style={styles.memberAvatar}
                />
                <View>
                  <Text style={styles.estadoLabel}>{estado.label}</Text>
                  <Text style={styles.nombre}>{miembro.nombre}</Text>
                </View>
              </View>
              <View style={styles.puntos}>
                <Text style={styles.puntosValor}>{miembro.puntos}</Text>
                <Text style={styles.puntosLabel}>puntos</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    resizeMode: "contain",
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f618d",
    marginBottom: 20,
    textAlign: "justify",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  memberAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    resizeMode: "contain",
  },
  estadoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
    color: "#333",
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f618d",
  },
  puntos: {
    alignItems: "center",
  },
  puntosValor: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f618d",
  },
  puntosLabel: {
    fontSize: 12,
    color: "#666",
  },
});
