import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CardDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Charizard - Base Set</Text>
        <Text style={styles.price}>R$ 1.500,00</Text>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.text}>
          Esta é uma réplica colecionável da carta Charizard do Base Set de Pokémon TCG.
          Excelente item para colecionadores nostálgicos.
        </Text>

        <Text style={styles.sectionTitle}>Opções de Frete</Text>
        <Text style={styles.text}>• Frete Econômico - R$ 12,00 (até 10 dias úteis)</Text>
        <Text style={styles.text}>• Frete Expresso - R$ 35,00 (2 dias úteis)</Text>

        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        <Text style={styles.text}>• Cartão de crédito</Text>
        <Text style={styles.text}>• Pix</Text>
        <Text style={styles.text}>• Parcelamento em até 12x</Text>

        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.purchaseButtonText}>Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#bb86fc',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 4,
  },
  purchaseButton: {
    marginTop: 30,
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
  },
});

export default CardDetailScreen;
