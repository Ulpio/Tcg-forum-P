import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { auth } from '../../firebase/config';

const schema = Yup.object({
  email: Yup.string().email('Digite um email v\u00E1lido').required('Email \u00E9 obrigat\u00F3rio'),
  password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha \u00E9 obrigat\u00F3ria'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'As senhas n\u00E3o conferem'),
});

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; confirm?: string}>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = async () => {
    try {
      await schema.validate({ email, password, confirm }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const e: any = {};
      err.inner?.forEach((x: any) => { if (x.path) e[x.path] = x.message; });
      setErrors(e);
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!(await validate())) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      Alert.alert('Erro', err.message || 'N\u00E3o foi poss\u00EDvel criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Cadastro</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#ccc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={t => { setEmail(t); if (errors.email) setErrors(p => ({...p, email: undefined})); }}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#ccc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={t => { setPassword(t); if (errors.password) setErrors(p => ({...p, password: undefined})); }}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#ccc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={confirm}
              onChangeText={t => { setConfirm(t); if (errors.confirm) setErrors(p => ({...p, confirm: undefined})); }}
            />
          </View>
          {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.linkBack}>
            <Text style={styles.linkText}>Voltar para Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
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
  errorText: { color: '#ff4444', fontSize: 12, marginTop: -8, marginBottom: 12, marginLeft: 4 },
  button: {
    backgroundColor: '#6200ee',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkBack: { marginTop: 20 },
  linkText: { color: '#6200ee' },
});
