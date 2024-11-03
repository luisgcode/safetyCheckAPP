// app/screens/Register.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import styles from "../styles/RegisterStyles";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please complete all fields.");
      return;
    }

    try {
      console.log("Attempting to register user...");

      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      console.log("User created: ", userCredential);
      const user = userCredential.user;

      // Save user details to Firestore
      console.log("Saving user details to Firestore...");
      await addDoc(collection(FIRESTORE_DB, "users"), {
        firstName,
        lastName,
        email,
        uid: user.uid,
      });
      console.log("User details saved successfully.");

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        "Success",
        "User registered successfully! A verification email has been sent."
      );
    } catch (error) {
      console.error("Error registering user: ", error);
      Alert.alert("Error", "Error registering user: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
