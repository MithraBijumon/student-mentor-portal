import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AnnouncementScreen() {
  return (
    <View style={styles.container}>
      <Text>Announcements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
