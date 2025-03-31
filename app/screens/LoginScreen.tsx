import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenido a <Text style={styles.brandText}>Whizzy</Text>
        </Text>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.decor}
        />
      </View>

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

        {/* Botón Login */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Enlace Registro */}
        <Text style={styles.signupLink}>
          ¿No tienes cuenta?{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("Signup")}
          >
            Regístrate
          </Text>
        </Text>

        {/* Alternativas */}
        <View style={styles.socialContainer}>
          <View style={styles.socialButtons}>
            <Image
              source={require("../../assets/images/favicon.png")}
              style={styles.icon}
            />
            <Image
              source={require("../../assets/images/favicon.png")}
              style={styles.icon}
            />
          </View>
          <Text style={styles.socialText}>
            Inicia sesión con Google o Apple
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 22,
    color: "#1f618d",
    textAlign: "center",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f618d",
  },
  decor: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    marginTop: 10,
  },
  form: {
    marginTop: 20,
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
  socialContainer: {
    alignItems: "center",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  socialText: {
    color: "#888",
  },
});
