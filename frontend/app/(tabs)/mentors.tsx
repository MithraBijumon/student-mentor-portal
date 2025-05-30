import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function MentorsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>List of Mentors</Text>
      <Button title="Chat with Mentor 1" onPress={() => router.push('/chat/mentor1')} />
    </View>
  );
}