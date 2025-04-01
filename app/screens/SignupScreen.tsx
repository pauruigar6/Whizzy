import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";

const { height } = Dimensions.get("window");

export default function SignupScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }

    if (password && !validatePassword(password)) {
      setPasswordError(
        "Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número."
      );
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(pwd);
  };

  const handleSignup = async () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    if (!email) {
      setEmailError("El correo es obligatorio.");
      valid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirma tu contraseña.");
      valid = false;
    }

    if (!agreed) {
      setTermsError("Debes aceptar los términos y condiciones.");
      valid = false;
    }

    if (!valid) return;

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        setEmailError("Este correo ya está registrado.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        email: user.email,
        uid: user.uid,
        creadoEn: new Date(),
      });

      navigation.navigate("Login");
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setEmailError("El formato del correo es inválido.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("La contraseña es demasiado débil.");
      } else {
        setEmailError("Ha ocurrido un error. Intenta nuevamente.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.brandText}>Whizzy</Text>
        </View>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.image}
        />

        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setAgreed(!agreed);
              setTermsError("");
            }}
          >
            <View style={styles.checkbox}>
              {agreed && <View style={styles.checkboxSelected} />}
            </View>
            <Text style={styles.checkboxText}>
              Estoy de acuerdo con los términos y condiciones{" "}
              <Ionicons name="book-outline" size={16} />
            </Text>
          </TouchableOpacity>
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupText}>Inscríbete</Text>
          </TouchableOpacity>

          <Text style={styles.loginLink}>
            ¿Ya tienes una cuenta?{" "}
            <Text style={{ fontWeight: "bold" }} onPress={() => navigation.navigate("Login")}>
              Acceder
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
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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
    marginVertical: 20,
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

});
