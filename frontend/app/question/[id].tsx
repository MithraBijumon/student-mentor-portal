// app/question/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

interface Reply {
  id: number;
  author: string;
  message: string;
}

interface QuestionDetail {
  id: number;
  title: string;
  content: string;
  is_answered: boolean;
  replies: Reply[];
}

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.56.1:8000/api/questions/${id}/`);
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
    try {
      await axios.post(`http://192.168.56.1:8000/api/questions/${id}/reply/`, {
        message: reply,
        author: 'Student', // Replace with actual user name if available
      });
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
      <Text style={styles.content}>{question.content}</Text>

      <Text style={styles.sectionHeading}>Replies:</Text>
      <FlatList
        data={question.replies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.replyCard}>
            <Text style={styles.replyAuthor}>{item.author}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      {!question.is_answered && (
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
      )}
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

