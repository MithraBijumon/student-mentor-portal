import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DoubtDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Doubt Detail Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
