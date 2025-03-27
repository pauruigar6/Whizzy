import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useState } from "react";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: "Construye su lista de tareas domésticas",
    description:
      "Elabora tu lista de tareas y calcula su valor en puntos. Organízalas en categorías y prográmalas.",
    image: require("../assets/dino.png"), // Asegúrate de tener la imagen en la carpeta /assets
  },
  {
    id: "2",
    title: "Organiza tus tareas",
    description:
      "Categoriza tus tareas en grupos y programa sus fechas de cumplimiento.",
    image: require("../assets/organize.png"),
  },
  {
    id: "3",
    title: "Controla tu progreso",
    description:
      "Revisa tus logros y mantente motivado para completar tus tareas diarias.",
    image: require("../assets/progress.png"),
  },
];

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(slideIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeSlide === index && styles.activeDot]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonText}>Crear una cuenta Nipto</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta? Acceder</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  slide: { width, alignItems: "center", padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5B400",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
  },
  pagination: { flexDirection: "row", alignSelf: "center", marginVertical: 20 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    margin: 5,
  },
  activeDot: { backgroundColor: "#F5B400" },
  button: {
    backgroundColor: "#F5B400",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  loginText: { color: "#666", marginTop: 10 },
});

export default HomeScreen;
