import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface InterfaceSelect {
  label: string;
  value: string;
}

interface UFResponse {
  sigla: string;
}

interface CityResponse {
  nome: string;
}

const Home = () => {
  const [ufList, setUfList] = useState<InterfaceSelect[]>([]);
  const [cityList, setCityList] = useState<InterfaceSelect[]>([]);
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city,
    });
  }

  useEffect(() => {
    axios
      .get<UFResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
      )
      .then((response) => {
        const ufsResponse = response.data.map((uf) => {
          return { label: uf.sigla, value: uf.sigla };
        });
        setUfList(ufsResponse);
      });
  }, []);

  useEffect(() => {
    if (!uf) {
      return;
    }
    axios
      .get<CityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
      )
      .then((response) => {
        const citiesResponse = response.data.map((city) => {
          return { label: city.nome, value: city.nome };
        });
        setCityList(citiesResponse);
      });
  }, [uf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={{
              viewContainer: {
                height: 60,
                justifyContent: "center",
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
              },
            }}
            textInputProps={{ textAlignVertical: "auto" }}
            placeholder={{
              label: "Selecione um estado",
              value: null,
              color: "#9EA0A4",
            }}
            onValueChange={(value, index) => {
              setUf(value);
            }}
            items={ufList}
          />
          <RNPickerSelect
            style={{
              viewContainer: {
                height: 60,
                justifyContent: "center",
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
              },
            }}
            placeholder={{
              label: "Selecione uma cidade",
              value: null,
              color: "#9EA0A4",
            }}
            onValueChange={(value, index) => {
              setCity(value);
            }}
            items={cityList}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            autoCorrect={false}
            onChangeText={setCity}
          /> */}

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
