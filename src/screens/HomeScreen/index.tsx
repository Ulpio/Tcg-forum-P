import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;



const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TCG Fórum</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('News')}>
        <Text style={styles.cardText}>Notícias</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Forum')}>
        <Text style={styles.cardText}>Fórum</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.cardText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  card: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default HomeScreen;
