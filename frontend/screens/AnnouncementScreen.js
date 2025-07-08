import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import { ENDPOINTS } from '../app/env'; // Adjust path if needed

export default function AnnouncementScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // track which announcement is expanded

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(ENDPOINTS.ANNOUNCEMENTS);
      setAnnouncements(res.data?.results || res.data);
    } catch (err) {
      Alert.alert('Failed to load announcements');
      console.error(err);
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post(ENDPOINTS.ANNOUNCEMENTS, { title, content });
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("POST announcement error:", err.response?.data || err.message);
      const msg = err.response?.data?.detail ||
        err.response?.data?.title?.[0] ||
        err.response?.data?.content?.[0] ||
        err.message || "Unknown error";
      Alert.alert('Failed to post announcement', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mentor Announcements</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.toggleText}>{showForm ? 'Cancel' : 'Post Announcement'}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, { height: 100 }]}
          />
          <Button title={loading ? "Posting..." : "Submit"} onPress={handlePost} disabled={loading} />
        </View>
      )}

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <TouchableOpacity
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={isExpanded ? 100 : 2} ellipsizeMode="tail">
                  {item.content}
                </Text>
                <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleText: { color: 'white', fontWeight: 'bold' },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  cardDate: { fontSize: 10, color: '#666', marginTop: 8 },
});
