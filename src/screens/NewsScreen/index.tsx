import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Share, Linking, Alert} from 'react-native';
import FilterBar from '../../components/FilterBar';
import { newsData } from '../../utils/MockData';
import { NewsItem } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'News'>;

const NewsScreen = () => {
  const [filter, setFilter] = useState<string>('Todos');
  const navigation = useNavigation<NavigationProp>();

  const filteredNews =
    filter === 'Todos'
      ? newsData
      : newsData.filter(item => item.category === filter);

  // Função para compartilhamento nativo
  const handleShare = async (item: NewsItem) => {
    try {
      await Share.share({
        title: item.title,
        message: `${item.title}\n\n${item.content}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a notícia.');
    }
  };

  // Função para compartilhar via WhatsApp
  const shareViaWhatsApp = (item: NewsItem) => {
    const message = encodeURIComponent(`${item.title}\n\n${item.content}`);
    const whatsappURL = `whatsapp://send?text=${message}`;

    Linking.openURL(whatsappURL).catch(() => {
      Alert.alert('Erro', 'WhatsApp não está instalado neste dispositivo.');
    });
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewsDetail', { id: item.id })}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text numberOfLines={2} style={styles.content}>
          {item.content}
        </Text>
      </TouchableOpacity>
      <View style={styles.shareRow}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare(item)}
        >
          <Text style={styles.shareText}>Compartilhar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shareButton, styles.whatsappButton]}
          onPress={() => shareViaWhatsApp(item)}
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
        data={filteredNews}
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
  content: {
    fontSize: 16,
    color: '#ccc',
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
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

export default NewsScreen;