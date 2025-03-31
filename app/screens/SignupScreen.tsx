import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig"; // ajusta si no usas alias

export default function SignupScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Error", "Completa todos los campos.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas no coinciden.");
    }

    if (!agreed) {
      return Alert.alert("Aviso", "Debes aceptar los términos.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        email: user.email,
        uid: user.uid,
        creadoEn: new Date(),
      });

      Alert.alert("¡Listo!", "Cuenta creada correctamente");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

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

      {/* Inputs */}
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
        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={styles.checkbox}>
            {agreed && <View style={styles.checkboxSelected} />}
          </View>
          <Text style={styles.checkboxText}>
            Estoy de acuerdo con los términos y condiciones{" "}
            <Ionicons name="book-outline" size={16} />
          </Text>
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupText}>Inscríbete</Text>
        </TouchableOpacity>

        {/* Enlace Acceder */}
        <Text style={styles.loginLink}>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("Login")}
          >
            Acceder
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
          <Text style={styles.socialText}>Inscríbete con Google o Apple</Text>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1f618d",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1f618d",
  },
  checkboxText: {
    color: "#666",
    flex: 1,
  },
  signupButton: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginLink: {
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
