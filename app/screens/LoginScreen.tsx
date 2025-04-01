import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Por favor completa todos los campos.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      const userData = userSnap.exists() ? userSnap.data() : null;
      const hasProfile = userData?.nombre && userData?.avatarIndex !== undefined;

      if (hasProfile) {
        navigation.navigate("SelectGroup");
      } else {
        navigation.navigate("ProfileSetup");
      }

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.brandText}>Whizzy</Text>
        </View>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.image}
        />

        {/* Formulario */}
        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <Text style={styles.signupLink}>
            ¿No tienes cuenta?{" "}
            <Text style={{ fontWeight: "bold" }} onPress={() => navigation.navigate("Signup")}>
              Regístrate
            </Text>
          </Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
    justifyContent: "flex-start",
  },
  header: {
    marginTop: height * 0.06,
    marginBottom: height * 0.006,
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
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
  },
  form: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#ebf5fb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupLink: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

});
