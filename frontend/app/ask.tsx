// app/ask.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ENDPOINTS } from './env';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AskScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [token, setToken] = useState('');
  const [authorId, setAuthorId] = useState(null); 
  const [anonymous, setAnonymous] = useState(false);
  const router = useRouter();

  // ✅ Fetch token and user
  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const userRes = await axios.get(`${ENDPOINTS.GET_USER}`, {
            headers: { Authorization: `Token ${storedToken}` },
          });
          setAuthorId(userRes.data.id); 
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchTokenAndUser();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Please fill out both fields');
      return;
    }

    if (!authorId) {
      Alert.alert('User not authenticated');
      return;
    }

    try {
      await axios.post(
        ENDPOINTS.CREATE_DOUBT,
        {
          title: title,
          text: body,
          anonymous: anonymous, 
        },
        {
          headers: {
            Authorization: `Token ${token}`, 
          },
        }
      );
      Alert.alert('Doubt posted!');
      router.replace('/home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        Alert.alert('Failed to post doubt', error.response?.data?.detail || 'Unknown error');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Failed to post doubt');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask a New Doubt</Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Describe your doubt..."
        style={[styles.input, { height: 100 }]}
        value={body}
        onChangeText={setBody}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      <View>
        <Checkbox.Item
          label="Post Anonymously"
          status={anonymous ? 'checked' : 'unchecked'}
          onPress={() => setAnonymous(!anonymous)}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

//TODO:
// 1. Integrate with backend and update question as unanswered