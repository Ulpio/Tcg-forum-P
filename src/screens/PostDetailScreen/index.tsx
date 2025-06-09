// src/screens/PostDetailScreen/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import type { ForumPost, Reply } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebase/config';
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

type RouteProps = RouteProp<RootStackParamList, 'PostDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen() {
  const { postId } = useRoute<RouteProps>().params;
  const navigation = useNavigation<NavigationProp>();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const postRef = doc(db, 'posts', postId);
    const unsubPost = onSnapshot(
      postRef,
      snap => {
        if (snap.exists()) {
          setPost({ id: snap.id, ...(snap.data() as Omit<ForumPost, 'id'>) });
        } else {
          setError('Post não encontrado.');
        }
        setLoading(false);
      },
      e => {
        console.error('Erro lendo post:', e);
        setError('Erro ao carregar o post.');
        setLoading(false);
      }
    );

    const repliesQuery = query(
      collection(db, 'posts', postId, 'replies'),
      orderBy('createdAt', 'asc')
    );
    const unsubReplies = onSnapshot(repliesQuery, snap => {
      setReplies(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Reply, 'id'>) }))
      );
    });

    return () => {
      unsubPost();
      unsubReplies();
    };
  }, [postId]);

  const handleSendReply = async () => {
    const user: User | null = auth.currentUser;
    if (!user) {
      alert('Faça login para responder.');
      return;
    }
    if (!replyText.trim()) return;

    setSubmitting(true);
    await addDoc(
      collection(db, 'posts', postId, 'replies'),  
      {
        text:      replyText,            
        authorId:  auth.currentUser!.uid,  
        createdAt: serverTimestamp(),  
      }
);
    try {
      await addDoc(collection(db, 'posts', postId, 'replies'), {
        text: replyText,
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });
      setReplyText('');
    } catch (e) {
      console.error('Erro enviando resposta:', e);
      alert('Não foi possível enviar a resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Post não encontrado.'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.category}>{post.category}</Text>
      <Text style={styles.content}>{post.content}</Text>

      <Text style={styles.subtitle}>Respostas</Text>
      <FlatList
        data={replies}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.replyBox}>
            <Text style={styles.replyText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noReplies}>Seja o primeiro a responder!</Text>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escreva sua resposta..."
            placeholderTextColor="#888"
            value={replyText}
            onChangeText={setReplyText}
            editable={!submitting}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendReply}
            disabled={submitting}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#121212' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  category: { fontSize: 16, fontStyle: 'italic', color: '#bbbbbb', marginBottom: 12 },
  content: { fontSize: 16, color: '#e0e0e0', marginBottom: 16, lineHeight: 22 },
  subtitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginVertical: 12 },
  replyBox: { backgroundColor: '#2a2a2a', padding: 12, borderRadius: 8, marginBottom: 8 },
  replyText: { color: '#ccc' },
  noReplies: { color: '#777', fontStyle: 'italic', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: { flex: 1, backgroundColor: '#2a2a2a', color: '#fff', padding: 10, borderRadius: 8 },
  sendButton: { marginLeft: 8, backgroundColor: '#556b2f', padding: 12, borderRadius: 8 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  backText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  error: { color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 12 },
});
