// src/screens/LoginScreen/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const validateForm = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const v: any = {};
      err.inner?.forEach((e: any) => { if (e.path) v[e.path] = e.message });
      setErrors(v);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!(await validateForm())) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await AsyncStorage.setItem('is_logged_in', 'true');
      // reset navigation to MainDrawer at root
      const parent = navigation.getParent() ?? navigation;
      parent.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainDrawer' }],
        })
      );
    } catch (err: any) {
      console.error('Login error:', err);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={{ uri: 'https://i.imgur.com/3DUJGuU.jpeg' }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login TCG</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#ccc" style={styles.inputIcon}/>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#ccc" style={styles.inputIcon}/>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#999"/>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupButton}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Error Modal */}
      <Modal
        transparent
        visible={showErrorModal}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Erro no Login</Text>
            <Text style={styles.modalMessage}>
              Falha ao autenticar. Verifique email e senha.
            </Text>
            <TouchableOpacity
              onPress={() => setShowErrorModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#ccc', marginBottom: 40 },
  formContainer: { width: '100%', maxWidth: 320 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: '#fff', fontSize: 16 },
  eyeIcon: { padding: 8 },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#6200ee',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: { color: '#ccc', fontSize: 14 },
  signupButton: { color: '#6200ee', fontSize: 14, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  modalMessage: { color: '#ccc', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
