import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SelectGroupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.brandText}>Whizzy</Text>
      </View>

      {/* Imagen ilustrativa */}
      <Image
        source={require("../../assets/images/logo.png")} // reemplázalo con tu ilustración
        style={styles.illustration}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Crear nuevo equipo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear un nuevo equipo</Text>
          <Text style={styles.cardText}>
            Empieza con un nuevo equipo o casa, descubre Whizzy e invita a otros miembros.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Crear un nuevo equipo</Text>
          </TouchableOpacity>
        </View>

        {/* Unirse con código */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Únase a un equipo existente con código
          </Text>
          <Text style={styles.cardText}>
            Consigue un código de invitación de otro miembro de Whizzy. Rellena el código y únete al equipo automáticamente.
          </Text>
          <TextInput style={styles.input} placeholder="Código de invitación" />
        </View>

        {/* Unirse con enlace */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Únase a un equipo existente con enlace
          </Text>
          <Text style={styles.cardText}>
            Consigue un enlace de invitación de otro miembro de Whizzy. Ábrelo o pégalo aquí para unirte.
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
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#f5b400",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
