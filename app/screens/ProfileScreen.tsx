import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  getDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [grupoActual, setGrupoActual] = useState(null);
  const [otrosGrupos, setOtrosGrupos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDataAndGroups = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setEmail(user.email || "");

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setNombre(userData?.nombre ?? "");

        const grupoIdActual = userData?.grupoId ?? null;
        if (grupoIdActual) {
          const grupoRef = doc(db, "grupos", grupoIdActual);
          const grupoSnap = await getDoc(grupoRef);
          if (grupoSnap.exists()) {
            const data = grupoSnap.data();
            setGrupoActual({
              id: grupoIdActual,
              nombre: data.nombre || "Grupo sin nombre",
              codigo: data.codigoInvitacion,
            });
          }
        }

        const gruposQuery = query(
          collection(db, "grupos"),
          where("miembros", "array-contains", user.uid)
        );
        const snapshot = await getDocs(gruposQuery);

        const gruposRestantes = snapshot.docs
          .filter((doc) => doc.id !== grupoIdActual)
          .map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre || "Grupo sin nombre",
            codigo: doc.data().codigoInvitacion,
          }));

        setOtrosGrupos(gruposRestantes);
      }
    };

    fetchUserDataAndGroups();
  }, []);

  // Muestra un mensaje según la plataforma (Android: Toast, iOS: Alert)
  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Whizzy", message);
    }
  };

  // Confirma la acción de cerrar sesión
  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: handleLogout,
        },
      ]
    );
  };

  // Cierra la sesión y redirige a WelcomeScreen
  const handleLogout = async () => {
    try {
      // Cierra la sesión con Firebase
      await signOut(auth);
      showToast("Sesión cerrada correctamente");
      // Redirige a la pantalla WelcomeScreen
      router.replace("/screens/WelcomeScreen");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <Text style={styles.value}>{nombre}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Grupo actual</Text>
          {grupoActual ? (
            <View>
              <Text style={styles.value}>• {grupoActual.nombre}</Text>
              {grupoActual.codigo && (
                <Text style={[styles.value, { fontSize: 13, color: "#777" }]}>
                  Código: {grupoActual.codigo}
                </Text>
              )}
            </View>
          ) : (
            <Text style={[styles.value, { fontStyle: "italic", color: "#999" }]}>
              No estás en ningún grupo actualmente.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Otros grupos</Text>
          {otrosGrupos.length > 0 ? (
            otrosGrupos.map((grupo) => (
              <View key={grupo.id} style={{ marginBottom: 6 }}>
                <Text style={styles.value}>• {grupo.nombre}</Text>
                {grupo.codigo && (
                  <Text style={[styles.value, { fontSize: 13, color: "#777" }]}>
                    Código: {grupo.codigo}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={[styles.value, { fontStyle: "italic", color: "#999" }]}>
              No perteneces a otros grupos.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f618d",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f618d",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#1f618d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#ddd",
    fontWeight: "bold",
    fontSize: 16,
  },
});
