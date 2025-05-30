import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen (Doubts Feed)</Text>
      <Button title="Post a Doubt" onPress={() => navigation.navigate('PostDoubt')} />
      <Button title="Go to Announcements" onPress={() => navigation.navigate('Announcements')} />
      <Button title="View Mentors" onPress={() => navigation.navigate('Mentors')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
