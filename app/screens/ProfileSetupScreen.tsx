import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const avatars = [
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
  require("../../assets/images/logo.png"),
];

export default function ProfileSetupScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [nameError, setNameError] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email ?? "tu correo";

  const handleValidate = async () => {
    setNameError("");
    setAvatarError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("Por favor escribe un nombre.");
      hasError = true;
    }

    if (selectedAvatar === null) {
      setAvatarError("Debes elegir un avatar.");
      hasError = true;
    }

    if (!user) {
      setNameError("No se ha detectado usuario.");
      hasError = true;
    }

    if (hasError) return;

    try {
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        nombre: name,
        avatarIndex: selectedAvatar,
        creadoEn: new Date(),
      });

        router.replace("/screens/SelectGroupScreen");
    } catch (error: any) {
      setNameError("Ocurrió un error al guardar el perfil.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Empezar a jugar</Text>
          <Text style={styles.brandText}>Whizzy</Text>
        </View>

        <Text style={styles.description}>
          Has creado con éxito tu cuenta de Whizzy para{" "}
          <Text style={styles.email}>{userEmail}</Text>. Elige un nombre y un
          avatar para empezar a jugar.
        </Text>

        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError("");
          }}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <View style={styles.avatarList}>
          {avatars.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedAvatar(index);
                setAvatarError("");
              }}
            >
              <Image
                source={item}
                style={[
                  styles.avatar,
                  selectedAvatar === index && styles.selectedAvatar,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {avatarError ? <Text style={styles.errorText}>{avatarError}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleValidate}>
          <Text style={styles.buttonText}>Validar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const avatarSize = width / 5;

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
    marginBottom: height * 0.04,
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
  description: {
    fontSize: 18,
    color: "#666",
    lineHeight: width * 0.05,
  },
  email: {
    fontWeight: "bold",
    color: "#1f618d",
  },
  input: {
    backgroundColor: "#ebf5fb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  avatarList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "5%",
    paddingHorizontal: 10,
  },
  
  avatar: {
    width: avatarSize,
    height: avatarSize,
    margin: width * 0.015,
    opacity: 0.3,
    borderRadius: avatarSize / 2,
    resizeMode: "contain",
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: "#1f618d",
    opacity: 1,
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "5%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
