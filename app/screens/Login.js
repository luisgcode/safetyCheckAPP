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

const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40, // Aumenta el tamaño del logo
    height: 40, // Aumenta el tamaño del logo
    resizeMode: "contain", // Mantener la proporción
    overflow: "hidden", // Asegúrate de que el contenido no se salga
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-start", // Cambiado a flex-start para alinear los elementos en la parte superior
    padding: 20,
    backgroundColor: "#F3F4F6", // Color de fondo
  },
  image: {
    width: "100%", // Ajusta el ancho según lo necesites
    height: 50, // Ajusta la altura según lo necesites
    resizeMode: "contain", // Ajusta la imagen para que mantenga su proporción
    marginBottom: 20, // Espacio entre la imagen y el título
  },
  title: {
    fontSize: 16,
    marginBottom: 60, // Ajustado para mejor espaciado
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25, // Ajustado para mejor espaciado
    textAlign: "center",
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20, // Espaciado aumentado
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // Fondo blanco para el campo de entrada
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Espaciado debajo del contenedor de botones
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#1E3A5F", // Color de fondo del botón
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15, // Espacio entre botones y otros elementos
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
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
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#FF6347", // Color del botón de cierre
    borderRadius: 5,
    marginBottom: 15, // Espaciado aumentado
  },
  closeButtonText: {
    color: "#FFFFFF", // Texto blanco para el botón de cierre
    fontWeight: "bold",
  },
  selectedContactsContainer: {
    marginTop: 20,
  },
  selectedContactsTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedContactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginBottom: 10, // Espacio entre elementos de contacto
  },
  selectedContact: {
    fontSize: 16,
  },
  removeContactButton: {
    padding: 5,
  },
  removeContactText: {
    color: "red",
    fontSize: 16,
  },
  locationContainer: {
    marginBottom: 20,
    marginTop: 50,
  },
  loadingText: {
    color: "gray",
  },
  locationText: {
    fontSize: 16,
  },
  verificationContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  warning: {
    color: "red",
  },
  contactsContainer: {
    marginTop: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20, // Espaciado aumentado
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginBottom: 10, // Espacio entre elementos de contacto
  },
  contactText: {
    fontSize: 16,
  },
});

export default Login;
