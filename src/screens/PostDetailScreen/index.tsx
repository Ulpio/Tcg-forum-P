import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { forumPosts } from '../../utils/MockData';
import { Ionicons } from '@expo/vector-icons';

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const navigation = useNavigation();
  const { postId } = route.params;

  const post = forumPosts.find((p) => p.id === postId);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Post não encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.category}>{post.category}</Text>
      <Text style={styles.content}>{post.content}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#bbbbbb',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 40,
    lineHeight: 22,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default PostDetailScreen;
