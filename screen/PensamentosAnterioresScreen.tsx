import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../firebase/Firebase";
import { Pensamentos } from "./RegistrarScreen";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons'; 

import { SafeAreaView } from "react-native-safe-area-context";

const PensamentosAnterioresScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const pensamentosRef = collection(FIRESTORE_DB, "pensamentos");

    const subscriber = onSnapshot(pensamentosRef, {
      next: (snapshot) => {
        console.log("Updated");

        const pensamentos: Pensamentos[] = [];
        snapshot.docs.forEach((doc) => {
          pensamentos.push({
            id: doc.id,
            ...doc.data(),
          } as Pensamentos);
        });
        setPensamentos(pensamentos);
      },
    });
    return () => subscriber();
  }, []);

  const [pensamentos, setPensamentos] = useState<Pensamentos[]>([]);

  const renderPensamentos = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `pensamentos/${item.id}`);

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.pensamentosContainer}>
        <Text style={styles.pensamentosTitle}>Data:</Text>
        <Text style={styles.pensamentosText}>{item.date}</Text>

        <Text style={styles.pensamentosTitle}>Situação do humor:</Text>
        <Text style={styles.pensamentosText}>{item.situacaoHumor}</Text>

        <Text style={styles.pensamentosTitle}>Estado do humor:</Text>
        <Text style={styles.pensamentosText}>{item.estadoHumor}</Text>

        <Text style={styles.pensamentosTitle}>Pensamento automatico:</Text>
        <Text style={styles.pensamentosText}>{item.pensamentoAutomatico}</Text>

        <Text style={styles.pensamentosTitle}>Evidencias que apoiam: </Text>
        <Text style={styles.pensamentosText}>{item.evidenciasApoiam}</Text>

        <Text style={styles.pensamentosTitle}>Evidencias que não apoiam: </Text>
        <Text style={styles.pensamentosText}>{item.evidenciasNaoApoiam}</Text>

        <Text style={styles.pensamentosTitle}>Pensamento alternativo: </Text>
        <Text style={styles.pensamentosText}>{item.pensamentoAlternativo}</Text>

        <Text style={styles.pensamentosTitle}>
          Avaliação pensamento alternativo:{" "}
        </Text>
        <Text style={styles.pensamentosText}>
          {item.avaliacaoPensamentoAlternativo}
        </Text>

        <Text style={styles.pensamentosTitle}>Avaliação estado de humor: </Text>
        <Text style={styles.pensamentosText}>{item.avaliacaoEstadoHumor}</Text>

        <TouchableOpacity style={{width: '100%', flexDirection:'row', justifyContent:'flex-end'}}
        onPress={() => deleteItem()}>
          <EvilIcons name="trash" size={36} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 24,
          height: 24,
          marginTop: 30,
          borderRadius: 30,
          marginBottom: 10,
        }}
      >
        <AntDesign
          name="left"
          size={24}
          color={"black"}
        />
      </TouchableOpacity>

        {pensamentos.length > 0 && (
          <View>
            <FlatList
              data={pensamentos}
              renderItem={renderPensamentos}
              keyExtractor={(pensamentos: Pensamentos) => pensamentos.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 60}}
            />
          </View>
        )}
    </SafeAreaView>
  );
};

export default PensamentosAnterioresScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C197D4",
    paddingHorizontal: 20,
  },
  pensamentosContainer: {
    marginTop: 10,
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    elevation: 2,
  },
  pensamentosTitle: {
    color: "#B859C0",
    fontWeight: "bold",
    fontSize: 17,
    marginVertical: 5,
  },
  pensamentosText: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 16,
    fontStyle: 'italic',
  },
});