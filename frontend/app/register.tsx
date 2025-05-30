import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function RegisterScreen() {
  const [roll, setRoll] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>
      <Text>Roll Number</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setRoll} value={roll} />
      <Text>Email</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setEmail} value={email} />
      <Button title="Register" onPress={() => alert('Verification mail sent!')} />
    </View>
  );
}