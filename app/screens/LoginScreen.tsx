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
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setLoginError("");

    if (!email || !password) {
      setLoginError("Por favor completa todos los campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const nombre = userData?.nombre;
        const avatarIndex = userData?.avatarIndex;

        const hasProfile = typeof nombre === "string" && nombre.trim() !== "" && typeof avatarIndex === "number";

        if (hasProfile) {
          navigation.navigate("SelectGroup");
        } else {
          navigation.navigate("ProfileSetup");
        }
      } else {
        navigation.navigate("ProfileSetup");
      }

    } catch (error: any) {
      setLoginError("El usuario o la contraseña introducidos no son correctos.");
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
            onChangeText={(text) => {
              setEmail(text);
              setLoginError("");
            }}
          />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLoginError("");
            }}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

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
    marginBottom: 10,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});
