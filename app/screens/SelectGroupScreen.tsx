import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  updateDoc,
  getDoc,
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
import { RootStackParamList } from "@/types/navigation";

const { width, height } = Dimensions.get("window");

const avatarImages = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

type NavigationProp = StackNavigationProp<RootStackParamList, "SelectGroup">;

export default function SelectGroupScreen() {
  const [codigo, setCodigo] = useState("");
  const [codigoError, setCodigoError] = useState(""); // ✅ error de código
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp>();

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

  const unirseConCodigo = async () => {
    setCodigoError(""); // limpiar errores previos
    const usuario = auth.currentUser;
    if (!usuario) return;

    if (!codigo.trim()) {
      setCodigoError("Introduce un código de invitación.");
      return;
    }

    try {
      const q = query(
        collection(db, "grupos"),
        where("codigoInvitacion", "==", codigo.trim())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setCodigoError("No se encontró ningún grupo con ese código.");
        return;
      }

      const grupoDoc = snapshot.docs[0];
      const grupoId = grupoDoc.id;

      await updateDoc(doc(db, "usuarios", usuario.uid), {
        grupoId,
      });

      await updateDoc(doc(db, "grupos", grupoId), {
        miembros: arrayUnion(usuario.uid),
      });

      // navigation.navigate("Home");
    } catch (error: any) {
      setCodigoError("Error al unirse al grupo.");
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
      console.error("Error al crear grupo:", error.message);
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
          <Text style={styles.cardTitle}>Crear un nuevo equipo</Text>
          <Text style={styles.cardText}>
            Empieza con un nuevo equipo o casa, descubre Whizzy e invita a otros miembros.
          </Text>
          <TouchableOpacity style={styles.button} onPress={crearGrupoEIr}>
            <Text style={styles.buttonText}>Crear un nuevo equipo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Únase a un equipo existente con código</Text>
          <Text style={styles.cardText}>
            Consigue un código de invitación de otro miembro de Whizzy. Rellena el código y únete al equipo automáticamente.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código de invitación"
            value={codigo}
            onChangeText={(text) => {
              setCodigo(text);
              setCodigoError("");
            }}
          />
          {codigoError ? <Text style={styles.errorText}>{codigoError}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={unirseConCodigo}
          >
            <Text style={styles.buttonText}>Unirse con código</Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: 200,
    height: 40,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
