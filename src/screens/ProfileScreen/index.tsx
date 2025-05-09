import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface FormErrors {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Schema de validação usando Yup
const updateProfileSchema = Yup.object({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  currentPassword: Yup.string()
    .min(6, 'A senha atual deve ter pelo menos 6 caracteres')
    .required('Senha atual é obrigatória'),
  newPassword: Yup.string()
    .min(8, 'A nova senha deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'As senhas não conferem')
});

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData>({
    name: 'Jogador TCG',
    email: 'jogador@tcg.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });
  
  // Estados para formulário
  const [email, setEmail] = useState<string>(userData.email);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    checkLoginAndGetLocation();
  }, []);

  const checkLoginAndGetLocation = async () => {
    try {
      const logged = await AsyncStorage.getItem('is_logged_in');
      if (logged !== 'true') {
        navigation.replace('Login');
        return;
      }

      // Buscar localização
      await getLocation();
    } catch (error) {
      console.error('Erro ao verificar login:', error);
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permissão negada para acessar localização.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = loc.coords;
      setLocation(`Latitude: ${coords.latitude.toFixed(4)}, Longitude: ${coords.longitude.toFixed(4)}`);
    } catch (error) {
      setLocation('Erro ao obter localização.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('is_logged_in');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer logout. Tente novamente.');
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Resetar campos quando entrar no modo de edição
      setEmail(userData.email);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  };

  const validateForm = async () => {
    try {
      await updateProfileSchema.validate(
        { 
          email, 
          currentPassword, 
          newPassword, 
          confirmPassword 
        }, 
        { abortEarly: false }
      );
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        error.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path as keyof FormErrors] = e.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    const isValid = await validateForm();
    
    if (isValid) {
      // Simulação de atualização bem-sucedida
      setUserData({
        ...userData,
        email: email
      });
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setEditMode(false);
      // Limpar os campos de senha
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Perfil do Usuário</Text>
            <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
              <Text style={styles.editButtonText}>
                {editMode ? 'Cancelar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          
          {!editMode ? (
            // Modo de visualização
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#ccc" />
                <Text style={styles.infoLabel}>Nome:</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color="#ccc" />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>

              <View style={styles.locationContainer}>
                <Text style={styles.subtitle}>Localização atual:</Text>
                {loading ? (
                  <ActivityIndicator size="large" color="#6200ee" />
                ) : (
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color="#ccc" />
                    <Text style={styles.infoValue}>{location}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            // Modo de edição
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Atualizar Informações</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Seu email"
                  placeholderTextColor="#999"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Senha Atual</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Senha atual"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showCurrentPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nova Senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Nova senha (opcional)"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showNewPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirme a nova senha"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={handleUpdateProfile}
              >
                <Text style={styles.updateButtonText}>Atualizar Perfil</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#6200ee',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  locationContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileScreen;