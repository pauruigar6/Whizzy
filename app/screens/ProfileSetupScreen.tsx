import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // ajusta si no usas alias

const avatars = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

export default function ProfileSetupScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email ?? "tu correo";

  const handleValidate = async () => {
    if (!name || selectedAvatar === null || !user) {
      return Alert.alert(
        "Faltan datos",
        "Debes escribir tu nombre y elegir un avatar."
      );
    }

    try {
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        nombre: name,
        avatarIndex: selectedAvatar,
        creadoEn: new Date(),
      });

      Alert.alert("Perfil guardado", `¡Hola ${name}!`);
      navigation.navigate("SelectGroup"); // 👈 Redirige a la nueva screen
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Empezar a jugar</Text>
        <Text style={styles.brandText}>Whizzy</Text>
      </View>

      <Text style={styles.description}>
        Has creado con éxito tu cuenta de Whizzy para{" "}
        <Text style={styles.email}>{userEmail}</Text>.{"\t"}
        Elige un nombre y un avatar para empezar a jugar.
      </Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <FlatList
        data={avatars}
        keyExtractor={(_, i) => i.toString()}
        numColumns={4}
        contentContainerStyle={{ alignItems: "center", marginVertical: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setSelectedAvatar(index)}>
            <Image
              source={item}
              style={[
                styles.avatar,
                selectedAvatar === index && styles.selectedAvatar,
              ]}
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleValidate}>
        <Text style={styles.buttonText}>Validar</Text>
      </TouchableOpacity>
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
  description: {
    fontSize: 15,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },
  email: {
    fontWeight: "bold",
    color: "#1f618d",
  },
  input: {
    backgroundColor: "#ebf5fb",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 10,
    opacity: 0.3,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: "#1f618d",
    borderRadius: 30,
    opacity: 1,
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
