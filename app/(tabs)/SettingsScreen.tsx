import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, signOut } from "firebase/firestore";

const { height } = Dimensions.get("window");

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

export default function SettingsScreen() {
  const [nombre, setNombre] = useState("");
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
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

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/screens/WelcomeScreen");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Contenido */}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        <Text style={styles.title}>Ajustes</Text>

        {/* Sección Cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* Sección Preferencias */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Notificaciones</Text>
            <Switch
              value={notificaciones}
              onValueChange={(value) => setNotificaciones(value)}
            />
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Modo oscuro</Text>
            <Switch
              value={modoOscuro}
              onValueChange={(value) => setModoOscuro(value)}
            />
          </View>
        </View>

        {/* Sección Soporte */}
        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Ayuda y preguntas frecuentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Contacto</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: height * 0.06,
    marginBottom: height * 0.06,
    position: "relative",
  },
  welcomeText: { fontSize: 22, color: "#1f618d" },
  brandText: { fontSize: 28, fontWeight: "bold", color: "#1f618d" },
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
  content: { paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f618d",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#1f618d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
