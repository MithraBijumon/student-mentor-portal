// app/(tabs)/AnnouncementsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function AnnouncementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mentor Announcements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
})