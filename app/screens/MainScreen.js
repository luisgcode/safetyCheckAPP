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
import styles from "../styles/MainScreenStyle";

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

export default MainScreen;
