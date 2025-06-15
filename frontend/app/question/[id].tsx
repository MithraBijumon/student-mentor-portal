// app/question/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { ENDPOINTS } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Reply {
  id: number;
  author: string;
  text: string;
}

interface Question {
  id: number;
  title: string;
  text: string;
  answered: boolean;
  replies: Reply[];
}

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
    };
    getToken();
  }, []);
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.GET_DOUBTS}${id}/`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    if (loading || !question) {
      return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
    }
    try {
      await axios.post(
        `${ENDPOINTS.CREATE_REPLY}${question.id}/replies/`,
        { text: reply },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (!question.answered) {
      await axios.patch(
        `${ENDPOINTS.MARK_AS_ANSWERED}${question.id}/mark-answered/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
    }
      Alert.alert("Reply Posted")
      setReply('');
      fetchQuestion();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (loading || !question) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.content}>{question.text}</Text>

      <Text style={styles.sectionHeading}>Replies:</Text>
      <FlatList
        data={question.replies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.replyCard}>
            <Text style={styles.replyAuthor}>{item.author}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.replyBox}>
        <TextInput
          placeholder="Write a reply..."
          style={styles.input}
          value={reply}
          onChangeText={setReply}
          multiline
        />
        <Button title={submitting ? "Sending..." : "Send"} onPress={submitReply} disabled={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  replyCard: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  replyAuthor: {
    fontWeight: 'bold',
  },
  replyBox: {
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
  },
});

