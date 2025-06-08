import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from "react";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import LoginScreen from "react-native-login-screen";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <LoginScreen
      logoImageSource={require('../assets/images/icon.png')}
      onLoginPress={() => router.replace('/(tabs)/home')}
      onSignupPress={() => {}}
      onEmailChange={setUsername}
      onPasswordChange={setPassword}
      enablePasswordValidation
    />
  );
}