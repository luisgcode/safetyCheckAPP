import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Linking,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import * as Contacts from "expo-contacts";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import styles from "../styles/LoginStyle";

const Login = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to access your location."
        );
        setLoadingLocation(false);
        return;
      }
      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords);
      setLoadingLocation(false);
    };

    getLocation();
  }, []);

  const handleSendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        alert("Verification email sent!");
      } catch (error) {
        alert("Error sending verification email: " + error.message);
      }
    }
  };

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setAllContacts(data);
          setShowContacts(true);
        } else {
          console.log("No contacts found");
        }
      } else {
        Alert.alert(
          "Permission denied",
          "Please enable contacts permission in your settings."
        );
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert("Error", "There was an error loading the contacts.");
    }
  };

  const handleSelectContact = (contact) => {
    const isSelected = selectedContacts.some((c) => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts((prevContacts) =>
        prevContacts.filter((c) => c.id !== contact.id)
      );
    } else {
      const newContact = {
        id: contact.id,
        name:
          contact.name ||
          `${contact.firstName || ""} ${contact.lastName || ""}`,
        phoneNumber:
          contact.phoneNumbers && contact.phoneNumbers[0]
            ? contact.phoneNumbers[0].number
            : "No phone number",
      };
      setSelectedContacts((prevContacts) => [...prevContacts, newContact]);
    }
  };

  const removeContact = (id) => {
    setSelectedContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  const closeContacts = () => {
    setShowContacts(false);
  };

  const sendSMS = async () => {
    if (await SMS.isAvailableAsync()) {
      if (location && selectedContacts.length > 0) {
        const { latitude, longitude } = location;
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `Hello, this is Luis Guaiquirian. You are receiving this SMS because you are my emergency contact. I just want to let you know my location: Latitude: ${latitude}, Longitude: ${longitude}. Open in Google Maps: ${googleMapsLink}`;

        const contactNumbers = selectedContacts.map(
          (contact) => contact.phoneNumber
        );

        try {
          const result = await SMS.sendSMSAsync(contactNumbers, message);
          if (result.result) {
            Alert.alert("Success", "SMS sent successfully!");
          } else {
            Alert.alert(
              "Error",
              "Failed to send SMS. Please check the numbers and try again."
            );
          }
        } catch (error) {
          Alert.alert(
            "Error",
            "An error occurred while sending SMS: " + error.message
          );
        }
      } else {
        Alert.alert(
          "Error",
          "Please select at least one contact and wait for the location to load."
        );
      }
    } else {
      Alert.alert("Error", "SMS is not available on this device.");
    }
  };

  const sendEmailWithCoordinates = () => {
    if (location) {
      const { latitude, longitude } = location;
      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const subject = "My Location Coordinates";
      const body = `Hello, this is Luis Guaiquirian. My location is: Latitude: ${latitude}, Longitude: ${longitude}. You can view my location on Google Maps here: ${googleMapsLink}`;
      const emailUrl = `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      Linking.openURL(emailUrl).catch((err) =>
        Alert.alert("Error", "An error occurred: " + err)
      );
    } else {
      Alert.alert("Error", "Location data is not available.");
    }
  };

  const filteredContacts = allContacts.filter((contact) =>
    (contact.name || `${contact.firstName || ""} ${contact.lastName || ""}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/S_C.png")} // Cambia la ruta a tu logo
          style={styles.logo}
        />
        <View style={styles.locationContainer}>
          {loadingLocation ? (
            <Text style={styles.loadingText}>
              Wait 10 seconds to load your coordinates...
            </Text>
          ) : location ? (
            <Text style={styles.locationText}>
              Location: {location.latitude.toFixed(5)},{" "}
              {location.longitude.toFixed(5)}
            </Text>
          ) : null}
        </View>
        {user ? (
          <View style={styles.content}>
            <Text style={styles.title}>Welcome, {user.email}!</Text>
            {!user.emailVerified && (
              <View style={styles.verificationContainer}>
                <Text style={styles.warning}>Your email is not verified.</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendVerificationEmail}
                >
                  <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={loadContacts}>
              <Text style={styles.buttonText}>Load Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedContacts.length === 0 && styles.disabledButton,
              ]}
              onPress={sendSMS}
              disabled={selectedContacts.length === 0}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !location && styles.disabledButton]}
              onPress={sendEmailWithCoordinates}
              disabled={!location}
            >
              <Text style={styles.buttonText}>Send Email with Coordinates</Text>
            </TouchableOpacity>

            {/* Mostrar los contactos seleccionados */}
            {selectedContacts.length > 0 && (
              <View style={styles.selectedContactsContainer}>
                <Text style={styles.selectedContactsTitle}>
                  Selected Contacts:
                </Text>
                <FlatList
                  data={selectedContacts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.selectedContactItem}>
                      <Text style={styles.selectedContact}>
                        {item.name || item.phoneNumber}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeContact(item.id)}
                        style={styles.removeContactButton}
                      >
                        <Text style={styles.removeContactText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text>Please log in first.</Text>
          </View>
        )}
        {/* Lista de contactos */}
        {showContacts && (
          <View style={styles.contactsContainer}>
            <TouchableOpacity
              onPress={closeContacts}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Contacts"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectContact(item)}
                  style={styles.contactItem}
                >
                  <Text style={styles.contactText}>
                    {item.name || `${item.firstName} ${item.lastName}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
