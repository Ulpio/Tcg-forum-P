import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Título obrigatório'),
  content: Yup.string().required('Conteúdo obrigatório'),
  category: Yup.string().oneOf(['Magic', 'Yu-Gi-Oh!', 'Pokémon']).required('Categoria obrigatória'),
});

const CreatePostScreen = () => {
  const handleSubmit = (values: any) => {
    Alert.alert('Post criado!', `Título: ${values.title}\nCategoria: ${values.category}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar novo post</Text>
      <Formik
        initialValues={{ title: '', content: '', category: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#888"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

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
            {touched.content && errors.content && <Text style={styles.error}>{errors.content}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Categoria (Magic, Yu-Gi-Oh! ou Pokémon)"
              placeholderTextColor="#888"
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              value={values.category}
            />
            {touched.category && errors.category && <Text style={styles.error}>{errors.category}</Text>}

            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default CreatePostScreen;