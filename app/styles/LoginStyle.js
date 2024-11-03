import { StyleSheet } from "react-native";

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
    paddingHorizontal: 10,
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
export default styles;
