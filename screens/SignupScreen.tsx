import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function SignUpScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Registro</Text>
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
