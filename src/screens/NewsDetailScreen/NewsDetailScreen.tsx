import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { newsData} from '../../utils/MockData';

type RouteProps = RouteProp<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const { id } = route.params;
  const news = newsData.find(item => item.id === id);

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Notícia não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.category}>{news.category}</Text>
      <Text style={styles.content}>{news.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default NewsDetailScreen;
