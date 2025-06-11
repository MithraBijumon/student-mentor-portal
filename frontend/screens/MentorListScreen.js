import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MentorListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Mentor List</Text>
      <Button title="Chat with Mentor" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

const renderMentor = ({ item }) => (
  <TouchableOpacity
    onPress={() => {
      // Handle button press here, e.g., navigate or open profile
      console.log("Mentor clicked:", item.name);
    }}
    style={styles.mentorCard} // Optional styling to make it look like a button
  >
    <Text style={styles.mentorName}>{item.name}</Text>
    <Text style={styles.mentorEmail}>{item.email}</Text>
  </TouchableOpacity>
);

  const renderMentor = ({ item }: { item: Mentor }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.username}</Text>
      <Text style={styles.roll}>Roll No: {item.roll_number}</Text>
    </View>
  );