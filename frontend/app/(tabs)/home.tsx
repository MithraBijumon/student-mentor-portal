// app/(tabs)/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface Question {
  id: number;
  title: string;
  is_answered: boolean;
}

export default function HomeScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const router = useRouter();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url =
        filter === 'all'
          ? 'https://your-app.onrender.com/posts/'
          : `https://your-app.onrender.com/posts/?filter=${filter}`;
      const response = await axios.get(url);
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const renderQuestion = ({ item }: { item: Question }) => (
    <TouchableOpacity
      style={styles.questionCard}
      onPress={() => router.push({ pathname: "/question/[id]", params: { id: item.id.toString() } })}

    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.is_answered ? '✅ Answered' : '❓ Unanswered'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discussion</Text>

      <View style={styles.filterContainer}>
        {['all', 'answered', 'unanswered'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as any)}
            style={filter === type ? styles.active : styles.button}
          >
            <Text style={{ fontWeight: filter === type ? 'bold' : 'normal' }}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.postButton} onPress={() => router.push('/ask')}>
        <Text style={styles.postButtonText}>+ Post Doubt</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQuestion}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  active: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#a0e0ff',
  },
  questionCard: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  postButton: {
  backgroundColor: '#007bff',
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
  alignItems: 'center',
},
postButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
});
