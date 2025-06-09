import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FilterBar, { FilterType } from '../../components/FilterBar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import type { ForumPost } from '../../types';
import { db, auth } from '../../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forum'>;

export default function ForumScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState<FilterType>('Todos');
  const [posts, setPosts] = useState<ForumPost[]>([]);

  
  const [replyForId, setReplyForId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snapshot => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ForumPost, 'id'>),
        }))
      );
    });
    return () => unsub();
  }, []);

  const filtered =
    filter === 'Todos'
      ? posts
      : posts.filter(item => item.category === filter);

  const handleReplySubmit = async () => {
    if (!replyForId) return;
    const user: User | null = auth.currentUser;
    if (!user) {
      alert('Faça login para responder.');
      return;
    }
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(
        collection(db, 'posts', replyForId, 'replies'),
        {
          text: replyText,
          authorId: user.uid,
          createdAt: serverTimestamp(),
        }
      );
      setReplyText('');
      setReplyForId(null);
    } catch (e) {
      console.error('Erro enviando resposta:', e);
      alert('Erro ao enviar resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: ForumPost }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.postArea}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </TouchableOpacity>

      {replyForId === item.id ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Sua resposta..."
              placeholderTextColor="#888"
              value={replyText}
              onChangeText={setReplyText}
              editable={!submitting}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleReplySubmit}
              disabled={submitting}
            >
              <Text style={styles.submitText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setReplyForId(item.id)}
        >
          <Text style={styles.replyButtonText}>Responder</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterBar filter={filter} setFilter={setFilter} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

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
  postArea: {
    flex: 1,
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
    fontSize: 15,
    color: '#ccc',
  },
  replyButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  replyButtonText: {
    color: '#556b2f',
    fontWeight: 'bold',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  submitButton: {
    marginLeft: 8,
    backgroundColor: '#556b2f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
