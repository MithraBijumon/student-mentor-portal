import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear user session data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      Alert.alert("Logged out");

      // Navigate to Login screen or welcome screen
      navigation.replace('Login'); // Ensure 'Login' screen exists in your navigator
    } catch (err) {
      Alert.alert("Error", "Could not log out properly.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
