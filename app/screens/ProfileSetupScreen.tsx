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

  // añade más...
];

export default function ProfileSetupScreen() {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleValidate = () => {
    if (!name || selectedAvatar === null) {
      return Alert.alert(
        "Faltan datos",
        "Debes escribir tu nombre y elegir un avatar."
      );
    }
    // Aquí guardarías los datos en Firestore si quieres
    Alert.alert("Perfil guardado", `¡Hola ${name}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Empezar a jugar</Text>
      <Text style={styles.subtitle}>
        Elige un nombre y un avatar para empezar
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f618d",
    marginBottom: 10,
    marginTop: 45,
  },
  subtitle: { fontSize: 16, color: "#555" },
  input: {
    backgroundColor: "#ebf5fb",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  avatar: {
    width: 60,
    height: 60,
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
