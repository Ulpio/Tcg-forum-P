import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { forumPosts } from '../../utils/MockData';



const PostDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const { postId } = route.params;

  const post = forumPosts.find((p) => p.id === postId);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.category}>{post.category}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#ccc',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default PostDetailScreen;