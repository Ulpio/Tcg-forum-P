import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import Card3D from '../../components/Card3D'; // ✅ ajuste o caminho conforme seu projeto

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardDetail'>;

const CardProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carta em destaque</Text>

      <Card3D /> 

      <Text style={styles.cardName}>Charizard - Base Set</Text>
      <Text style={styles.cardPrice}>R$ 1.500,00</Text>

      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => navigation.navigate('CardDetail')}
      >
        <Text style={styles.buyButtonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardPrice: {
    color: '#bb86fc',
    fontSize: 16,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardProductScreen;
