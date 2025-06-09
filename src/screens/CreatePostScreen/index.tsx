// src/screens/CreatePostScreen/index.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePost'
>;

const validationSchema = Yup.object().shape({
  title:    Yup.string().required('Título obrigatório'),
  content:  Yup.string().required('Conteúdo obrigatório'),
  category: Yup.string()
    .oneOf(['Magic', 'Yu-Gi-Oh!', 'Pokémon'])
    .required('Categoria obrigatória'),
});

export default function CreatePostScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = async (values: {
    title: string;
    content: string;
    category: string;
  }) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        'Não autenticado',
        'Você precisa fazer login para criar um post.',
        [{ text: 'Ir para Login', onPress: () => navigation.replace('Login') }]
      );
      console.log("entrou")
      return;
    }
    console.log("entrou")
    try {
      console.log("entrou")
      await addDoc(collection(db, 'posts'), {
        title:     values.title,
        content:   values.content,
        category:  values.category,
        authorId:  user.uid,
        createdAt: serverTimestamp(),
      });

      // 3) Confirma e redireciona
      Alert.alert('Sucesso', 'Tópico criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Forum'),
        },
      ]);
    } catch (err: any) {
      console.error('Erro criando post:', err);
      Alert.alert('Erro', err.message || 'Não foi possível criar o post.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo tópico</Text>
      <Formik
        initialValues={{ title: '', content: '', category: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#888"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && (
              <Text style={styles.error}>{errors.title}</Text>
            )}

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Conteúdo"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
              value={values.content}
            />
            {touched.content && errors.content && (
              <Text style={styles.error}>{errors.content}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Categoria (Magic, Yu-Gi-Oh! ou Pokémon)"
              placeholderTextColor="#888"
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              value={values.category}
            />
            {touched.category && errors.category && (
              <Text style={styles.error}>{errors.category}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: '#f66',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#556b2f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
