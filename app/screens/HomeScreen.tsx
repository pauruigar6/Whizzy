import React, { useState } from "react";
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

const { width, height } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: "Construye tu lista de tareas domésticas",
    description:
      "Elabora tu lista de tareas y calcula su valor en puntos. Organízalas en categorías y prográmalas.",
    image: require("../../assets/images/logo.png"),
  },
  {
    id: "2",
    title: "Organiza tus tareas",
    description:
      "Categoriza tus tareas en grupos y programa sus fechas de cumplimiento.",
    image: require("../../assets/images/home1.jpg"),
  },
  {
    id: "3",
    title: "Controla tu progreso",
    description:
      "Revisa tus logros y mantente motivado para completar tus tareas diarias.",
    image: require("../../assets/images/home3.jpg"),
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
      <View style={styles.sliderContainer}>
        {/* TÍTULO */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Bienvenido a <Text style={styles.brandText}>Whizzy</Text>
          </Text>
        </View>

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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Crear una cuenta Whizzy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? <Text style={styles.accessText}>Acceder</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  sliderContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: -200,
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
  slide: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f618d",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 70,

  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#1f618d",
  },
  buttonContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "#1f618d",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#666",
    marginTop: 10,
  },
  accessText: {
    color: "#666",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default HomeScreen;
