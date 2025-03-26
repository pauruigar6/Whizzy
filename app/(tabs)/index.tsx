import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  image?: any;
}

const slides: Slide[] = [
  {
    id: "1",
    image: require("@/assets/images/icon.png"),
    title: "Contruye tu lista de tareas",
    description: "Elabora tu lista de tareas y calcula su valor en puntos.",
  },
  {
    id: "2",
    image: require("@/assets/images/icon.png"),
    title: "Convierte tus tareas en un juego",
    description: "Gana puntos cada vez que realizas una tarea.",
  },
  {
    id: "3",
    image: require("@/assets/images/icon.png"),
    title: "Contruir una rutina de limpieza saludable",
    description:
      "Reparte las tareas de forma equitatiiva entre los miembros de la casa.",
  },
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slideContainer}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <ThemedText type="subtitle" style={styles.subtitle}>
        {item.title}
      </ThemedText>
      <ThemedText type="default" style={styles.description}>
        {item.description}
      </ThemedText>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
              Bienvenido a <Text style={styles.highlight}>Whizzy</Text>
            </ThemedText>

            <Animated.FlatList
              data={slides}
              renderItem={renderSlide}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              keyExtractor={(item) => item.id}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
            />

            <View style={styles.pagination}>
              {slides.map((_, index) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 16, 8],
                  extrapolate: "clamp",
                });
                return (
                  <Animated.View
                    key={index}
                    style={[styles.dot, { width: dotWidth }]}
                  />
                );
              })}
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Crear una cuenta Whizzy</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?{" "}
              <Text style={styles.linkText}>Acceder</Text>
            </Text>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    color: "#333",
  },
  highlight: {
    color: "#FFD700",
  },
  slideContainer: {
    width: width * 0.9,
    padding: 50,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFD700",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginHorizontal: 20,
    marginBottom: 0,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    color: "#666",
    marginTop: 10,
  },
  linkText: {
    color: "#333",
    fontWeight: "bold",
  },
});
