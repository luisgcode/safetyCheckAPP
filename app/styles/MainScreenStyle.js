import { StyleSheet } from "react-native";
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
export default styles;
