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
