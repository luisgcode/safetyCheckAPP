import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import for Firebase Auth
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import logo from "../../assets/S_C.png"; // Asegúrate de que la ruta sea correcta

const MainScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        alert(error.message); // Alert for error messages
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={logo} // Usa la variable importada
        style={styles.image}
      />
      <Text style={styles.title}>Safety Check</Text>
      <Text style={styles.subtitle}>Let them know where you are!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Evita que se capitalice la primera letra del email
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>© 2024 All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F3F4F6", // Color de fondo igual al de los estilos proporcionados
  },
  image: {
    width: "100%", // Ajusta el ancho según lo necesites
    height: 50, // Ajusta la altura según lo necesites
    resizeMode: "contain", // Ajusta la imagen para que mantenga su proporción
    marginBottom: 20, // Espacio entre la imagen y el título
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // Fondo blanco para el campo de entrada
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#1E3A5F", // Color de fondo del botón
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // Color del texto
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
});

export default MainScreen;
