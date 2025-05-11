import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Mapa de avatares que relaciona claves con sus respectivas imágenes.
 */
const avatarMap: Record<string, any> = {
  avatar1: require("@/assets/images/imagenPerfil.webp"),
  avatar2: require("@/assets/images/imagenPerfil2.webp"),
  avatar3: require("@/assets/images/imagenPerfil3.webp"),
  avatar4: require("@/assets/images/imagenPerfil4.webp"),
  avatar5: require("@/assets/images/imagenPerfil5.webp"),
  avatar6: require("@/assets/images/imagenPerfil6.webp"),
  avatar7: require("@/assets/images/imagenPerfil7.webp"),
  avatar8: require("@/assets/images/imagenPerfil8.webp"),
};

type Jugador = {
  idUsuario: number;
  nombre: string;
  victorias: number;
  avatar?: string;
};

export default function RankingScreen(): JSX.Element {
  const [ranking, setRanking] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl;

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Jugador[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filteredRanking, setFilteredRanking] = useState<Jugador[] | null>(
    null
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/ranking/ranking`);
        // ahora: todos los jugadores con al menos 1 victoria
        setRanking(
          response.data.ranking.filter((j: Jugador) => j.victorias > 0)
        );
      } catch (error) {
        console.error("Error al obtener el ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  /** Filtra localmente el ranking según el texto escrito */
  const fetchUserSuggestions = (nombre: string) => {
    const q = nombre.trim().toLowerCase();
    if (!q) {
      setSearchSuggestions([]);
      setFilteredRanking(null);
      return;
    }
    setLoadingSearch(true);
    const suggestions = ranking.filter((j) =>
      j.nombre.toLowerCase().includes(q)
    );
    setSearchSuggestions(suggestions);
    setFilteredRanking(suggestions);
    setLoadingSearch(false);
  };

  const onChangeNuevoNombre = (text: string) => {
    setNuevoNombre(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUserSuggestions(text), 500);
  };

  const onSelectSuggestion = async (s: Jugador) => {
    setNuevoNombre(s.nombre);
    setSearchSuggestions([]);
    setFilteredRanking([s]);
    setPage(1);
  };

  const clearSearch = () => {
    setFilteredRanking(null);
    setNuevoNombre("");
    setSearchSuggestions([]);
    setPage(1);
  };

  const displayRanking = filteredRanking
    ? filteredRanking
    : ranking.slice((page - 1) * pageSize, page * pageSize);

  const handlePress = async (jugador: Jugador) => {
    try {
      let id = jugador.idUsuario;
      if (!id && jugador.nombre) {
        const resp = await axios.post(
          `${BACKEND_URL}/api/usuario/obtener_por_nombre`,
          { nombre: jugador.nombre }
        );
        id = resp.data.usuario?.idUsuario;
      }
      if (!id) {
        console.error("ID de usuario indefinido");
        return;
      }
      await AsyncStorage.setItem("amigoId", id.toString());
      router.push({
        pathname: "/(perfil)/perfilAmigo",
        params: { amigoId: id.toString() },
      });
    } catch (err) {
      console.error("Error al navegar al perfil de amigo", err);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fondo-roles.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        <Text style={styles.header}>Ranking</Text>

        {/* Campo de búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Buscar jugador"
            placeholderTextColor="#000"
            value={nuevoNombre}
            onChangeText={onChangeNuevoNombre}
            onSubmitEditing={() => {
              setSearchSuggestions([]);
              Keyboard.dismiss();
            }}
          />
          {filteredRanking && (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {loadingSearch && <Text style={styles.textoAyuda}>Buscando…</Text>}

        {searchSuggestions.length > 0 && (
          <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
            {searchSuggestions.map((s) => (
              <TouchableOpacity
                key={s.idUsuario}
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(s)}
              >
                <Text style={styles.suggestionText}>{s.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <>
            <View style={styles.listWrapper}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {displayRanking.map((jugador, idx) => (
                  <TouchableOpacity
                    key={jugador.idUsuario}
                    onPress={() => handlePress(jugador)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardContainer}>
                      <View style={styles.cardHeader}>
                        <Image
                          source={
                            jugador.avatar && avatarMap[jugador.avatar]
                              ? avatarMap[jugador.avatar]
                              : require("@/assets/images/imagenPerfil.webp")
                          }
                          style={styles.avatar}
                        />
                        {(() => {
                          const rankNumber = filteredRanking
                            ? ranking.findIndex(
                                (j) => j.idUsuario === jugador.idUsuario
                              ) + 1
                            : (page - 1) * pageSize + idx + 1;
                          return <Text style={styles.rank}>{rankNumber}.</Text>;
                        })()}
                        <Text style={styles.nombre}>{jugador.nombre}</Text>
                      </View>
                      <Text style={styles.victorias}>
                        {jugador.victorias} Victorias
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Footer: paginación encima de la flecha */}
            <View style={styles.footer}>
              {!filteredRanking && (
                <View style={styles.pagination}>
                  <TouchableOpacity
                    disabled={page <= 1}
                    onPress={() => setPage(page - 1)}
                  >
                    <Text style={styles.pageButton}>Anterior</Text>
                  </TouchableOpacity>
                  <Text style={styles.pageInfo}>
                    {page}/{Math.ceil(ranking.length / pageSize)}
                  </Text>
                  <TouchableOpacity
                    disabled={page >= Math.ceil(ranking.length / pageSize)}
                    onPress={() => setPage(page + 1)}
                  >
                    <Text style={styles.pageButton}>Siguiente</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={styles.buttonBack}
                onPress={() => router.back()}
              >
                <Image
                  source={require("@/assets/images/botonAtras.png")}
                  style={styles.imageBack}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 60,
    zIndex: 1,
  },
  listWrapper: {
    flex: 1,
    marginBottom: 100,
  },
  scrollContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 100, // deja sitio para el footer
  },
  cardContainer: {
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  victorias: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  loader: {
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    alignItems: "center",
  },
  inputSearch: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    color: "#000",
  },
  clearText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  suggestionsContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 1000,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    zIndex: 2,
  },
  buttonBack: {},
  imageBack: {
    width: 40,
    height: 40,
  },
  textoAyuda: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  pageButton: {
    color: "#fff",
    marginHorizontal: 20,
  },
  pageInfo: {
    color: "#fff",
    fontWeight: "bold",
  },
});
