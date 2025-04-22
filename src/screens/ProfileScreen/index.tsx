import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const fakeUser = {
  name: 'Jogador TCG',
  email: 'jogador@tcg.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const logged = await AsyncStorage.getItem('is_logged_in');
      if (logged !== 'true') {
        navigation.replace('Login');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permissão negada para acessar localização.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = loc.coords;
      setLocation(`Latitude: ${coords.latitude.toFixed(4)}, Longitude: ${coords.longitude.toFixed(4)}`);
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('is_logged_in');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <Image source={{ uri: fakeUser.avatar }} style={styles.avatar} />
      <Text style={styles.info}>Nome: {fakeUser.name}</Text>
      <Text style={styles.info}>Email: {fakeUser.email}</Text>

      <Text style={styles.subtitle}>Localização atual:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Text style={styles.info}>{location}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 30,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;



