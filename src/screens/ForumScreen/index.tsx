import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Share, Linking, Alert, } from 'react-native';
import FilterBar from '../../components/FilterBar';
import { forumPosts } from '../../utils/MockData';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsItem, ForumPost } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forum'>;

const ForumScreen = () => {
  const [filter, setFilter] = useState<string>('Todos');
  const navigation = useNavigation<NavigationProp>();

  const filteredPosts =
    filter === 'Todos'
      ? forumPosts
      : forumPosts.filter(item => item.category === filter);

  const handleSharePost = async (post: ForumPost) => {
    try {
      await Share.share({
        title: post.title,
        message: `${post.title}\n\n${post.content}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o compartilhamento.');
    }
  };

  const sharePostViaWhatsApp = (post: ForumPost) => {
    const message = encodeURIComponent(`${post.title}\n\n${post.content}`);
    const whatsappURL = `whatsapp://send?text=${message}`;

    Linking.openURL(whatsappURL).catch(() => {
      Alert.alert('Erro', 'WhatsApp não está instalado neste dispositivo.');
    });
  };

  const renderItem = ({ item }: { item: ForumPost }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </TouchableOpacity>

      <View style={styles.shareRow}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleSharePost(item)}
        >
          <Text style={styles.shareText}>Compartilhar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shareButton, styles.whatsappButton]}
          onPress={() => sharePostViaWhatsApp(item)}
        >
          <Text style={styles.shareText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterBar filter={filter} setFilter={setFilter} />
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  category: {
    fontSize: 14,
    color: '#999',
    marginVertical: 4,
  },
  author: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  shareButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#444',
    borderRadius: 8,
    marginLeft: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ForumScreen;
