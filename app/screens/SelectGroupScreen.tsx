import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  updateDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  doc,
  collection,
  addDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation"; // Ajusta si no usas alias

type NavigationProp = StackNavigationProp<RootStackParamList, "SelectGroup">;

export default function SelectGroupScreen() {
  const [codigo, setCodigo] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const unirseConCodigo = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    if (!codigo.trim()) {
      return Alert.alert("Error", "Introduce un código de invitación.");
    }

    try {
      const q = query(
        collection(db, "grupos"),
        where("codigoInvitacion", "==", codigo.trim())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return Alert.alert(
          "Código no válido",
          "No se encontró ningún grupo con ese código."
        );
      }

      const grupoDoc = snapshot.docs[0];
      const grupoId = grupoDoc.id;

      await updateDoc(doc(db, "usuarios", usuario.uid), {
        grupoId,
      });

      await updateDoc(doc(db, "grupos", grupoId), {
        miembros: arrayUnion(usuario.uid),
      });

      Alert.alert("¡Te uniste al grupo!", "Ahora puedes empezar.");
      // navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error al unirse", error.message);
    }
  };

  const crearGrupoEIr = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const codigoInvitacion = Math.random().toString(36).substring(2, 8);

      const nuevoGrupo = await addDoc(collection(db, "grupos"), {
        nombre: "Nuevo grupo",
        creadoPor: usuario.uid,
        miembros: [usuario.uid],
        codigoInvitacion,
        creadoEn: new Date(),
      });

      await updateDoc(doc(db, "usuarios", usuario.uid), {
        grupoId: nuevoGrupo.id,
      });

      navigation.navigate("CreateGroup");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.brandText}>Whizzy</Text>
      </View>

      {/* Imagen ilustrativa */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.illustration}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Crear nuevo equipo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear un nuevo equipo</Text>
          <Text style={styles.cardText}>
            Empieza con un nuevo equipo o casa, descubre Whizzy e invita a otros
            miembros.
          </Text>
          <TouchableOpacity style={styles.button} onPress={crearGrupoEIr}>
            <Text style={styles.buttonText}>Crear un nuevo equipo</Text>
          </TouchableOpacity>
        </View>

        {/* Unirse con código */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Únase a un equipo existente con código
          </Text>
          <Text style={styles.cardText}>
            Consigue un código de invitación de otro miembro de Whizzy. Rellena
            el código y únete al equipo automáticamente.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código de invitación"
            value={codigo}
            onChangeText={setCodigo}
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={unirseConCodigo}
          >
            <Text style={styles.buttonText}>Unirse con código</Text>
          </TouchableOpacity>
        </View>

        {/* Unirse con enlace (no implementado aún) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Únase a un equipo existente con enlace
          </Text>
          <Text style={styles.cardText}>
            Consigue un enlace de invitación de otro miembro de Whizzy. Ábrelo o
            pégalo aquí para unirte.
          </Text>
          <TextInput style={styles.input} placeholder="Enlace de invitación" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { marginTop: 50 },
  welcomeText: {
    fontSize: 22,
    color: "#1f618d",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f618d",
  },
  illustration: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginVertical: 20,
  },
  content: {
    paddingBottom: 40,
  },
  card: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ebf5fb",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 200,
    alignItems: "center",
    width: 200,
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
