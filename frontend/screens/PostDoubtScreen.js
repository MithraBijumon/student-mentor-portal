import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PostDoubtScreen() {
  return (
    <View style={styles.container}>
      <Text>Post Doubt Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
