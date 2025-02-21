import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";

const MyPage = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/fondo-roles.jpg")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>¿CÓMO JUGAR?</Text>
          <Image
            source={require("@/assets/images/lobo.png")}
            style={styles.image}
          />
          <View style={styles.papiroContainer}>
            <Image
              source={require("@/assets/images/papiro.png")}
              style={styles.papiroImage}
            />
            <Text style={styles.papiroText}>
              Se reparten los roles a los jugadores. Cada jugador mira su carta
              para saber cuál es su personaje, información que mantendrá en
              secreto a menos que sea eliminado. El Narrador decide si los
              aldeanos votarán ahora un Alguacil (función adicional,
              independiente del personaje) por mayoría simple, o si el Alguacil
              será elegido más tarde en el transcurso de la partida. El voto del
              Alguacil cuenta como dos votos. El juego comienza en la noche.
            </Text>
            <View style={styles.buttonsContainerColumn}>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={require("@/assets/images/lobo.png")}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Noche</Text>
                <Image
                  source={require("@/assets/images/lobo.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={require("@/assets/images/lobo.png")}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Día</Text>
                <Image
                  source={require("@/assets/images/lobo.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  content: {
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  papiroContainer: {
    position: "relative",
    marginTop: 20,
    width: 250,
    height: 400,
  },
  papiroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  papiroText: {
    fontWeight: 'bold',
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    color: "#000",
    fontSize: 12,
    textAlign: "center",
    padding: 10,
  },
  buttonsContainerColumn: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 40,
    backgroundColor: "#f0efeb",
    borderRadius: 10,
    marginVertical: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
});

export default MyPage;