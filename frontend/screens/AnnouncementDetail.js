// app/AnnouncementDetail.js
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function AnnouncementDetail() {
  const { title, content, created_at } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.date}>{new Date(created_at).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  content: { fontSize: 16 },
  date: { marginTop: 20, fontSize: 12, color: '#666' },
});
