 //app/(tabs)/MentorsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Mentor {
  id: number;
  username: string;
  roll_number: string;
}

export default function MentorScreen() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        //const response = await axios.get('https://student-mentor-portal.onrender.com/users/?is_mentor=true');
        //setMentors(response.data);
        Alert.alert("Fetching mentors")
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

const renderMentor = ({ item }: {item: Mentor}) => (
  <TouchableOpacity
    onPress={() => router.push({
      pathname: "/dm/[id]",
      params: { id: item.id.toString() } 
    })}
    style={styles.card}
  >
    <Text style={styles.name}>{item.username}</Text>
    <Text style={styles.roll}>{item.roll_number}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Mentors</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={mentors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMentor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '600' },
  roll: { fontSize: 14, color: 'gray', marginTop: 4 },
});


