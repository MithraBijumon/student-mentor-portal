// app/ask.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AskScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Please fill out both fields');
      return;
    }

    try {
      await axios.post('https://student-mentor-portal.onrender.com/posts/', {
        title: title,
        text: body,
        author: 1  // or get actual name if available
});
      Alert.alert('Doubt posted!');
      router.replace('/home'); // redirect to home after posting
    } catch (error) {
      console.error('Error posting question:', error);
      Alert.alert('Failed to post doubt');
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