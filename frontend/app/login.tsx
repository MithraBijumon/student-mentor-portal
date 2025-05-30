import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [roll, setRoll] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text>Roll Number</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 20 }} onChangeText={setRoll} value={roll} />
      <Button title="Login" onPress={() => router.replace('/(tabs)/home')} />
    </View>
  );
}