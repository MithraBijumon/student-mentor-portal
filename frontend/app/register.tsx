//register.tsx
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from 'axios';
import { ENDPOINTS } from './env';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";;
export default function LoginScreen() {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();
  function togglePasswordVisibility (passwordType: "password"|"confirm") {
    passwordType=="password" ? setPasswordVisible(!passwordVisible) : setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const passwordsMatch = confirmPassword === password || confirmPassword === '';
  const fields = [
  {
    key: "password",
    value: password,
    setValue: setPassword,
    visible: passwordVisible,
    setVisible: setPasswordVisible,
  },
  {
    key: "confirmPassword",
    value: confirmPassword,
    setValue: setConfirmPassword,
    visible: confirmPasswordVisible,
    setVisible: setConfirmPasswordVisible,
  }
];
const handleSubmit = async () => {
    if (!Username.trim() || !Email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Please fill out all fields');
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Password do not match');
      return;
    }
    try {
      const response = await axios.post('http://192.168.151.198:8000/api/auth/register/', {
      username: Username,
      email: Email,
      password: password,
    });
      if (response.status === 201) {
      Alert.alert('Verification mail sent! Verify to login');
      router.replace('/login');
    } else {
      Alert.alert('Registration failed');
    }
    } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.email?.[0] || 'Registration failed');
  }
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logoIcon}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={Username}
          placeholder="Username"
        />
        <Ionicons
          name="person-circle-outline"
          size={24}
          color="grey"
          style={styles.UsernameIcon}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Email"
        />
        <Ionicons
          name="mail-outline"
          size={24}
          color="grey"
          style={styles.UsernameIcon}
        />
      </View>
      {fields.map((field) => (
        <View key={field.key} style={{ width: '100%' }}> 
          <View style={styles.inputContainer} key={field.key}>
            <TextInput
              style={[styles.input, field.key==="confirmPassword" && !passwordsMatch && styles.errorBorder]}
              onChangeText={field.setValue}
              value={field.value}
              placeholder={field.key === "password" ? "Password" : "Confirm Password"}
              secureTextEntry={!field.visible}
            />
            <TouchableOpacity
              onPress={() => field.setVisible(!field.visible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={field.visible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="grey"
              />
            </TouchableOpacity>
          </View>
          {field.key==="confirmPassword" && !passwordsMatch && (<Text style={styles.errorText}>Passwords do not match</Text>)}
        </View>
      ))}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Verification Email</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text>Already Have an Account</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp("4%"),
    backgroundColor: "#fff",
  },
  title: {
    fontSize: wp("6%"),
    marginBottom: hp("3%"),
    fontWeight: "bold",
  },
  logo: {
    marginBottom: hp("6%"),
  },
  input: {
    height: hp("7%"),
    width: "100%",
    marginVertical: hp("1%"),
    borderWidth: 1,
    padding: wp("2.5%"),
    borderRadius: 5,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#01a5fc",
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    marginTop: hp("2.5%"),
    width: '100%',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  forgotPassword: {
    color: "#0ed1c0",
    marginTop: hp("2.5%"),
    fontSize: wp("3.5%"),
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: hp("2.5%"),
  },
  loginText: {
    color: "#0ed1c0",
    marginLeft: wp("1%"),
    fontSize: wp("3.5%"),
  },
  logoIcon: {
    width: wp("30%"),
    height: wp("30%"),
    marginTop: hp("1%"),
    marginBottom: hp("4%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input2: {
    flex: 1,
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  eyeIcon: {
    position: "absolute",
    right: wp("2.5%"),
    padding: wp("2.5%"),
  },
  UsernameIcon: {
    position: "absolute",
    right: wp("2.5%"),
    padding: wp("2.5%"),
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
    marginLeft: 5,
  }
});

//TODO:
// 1. Send verification email
// 2. Integrate with backend so user, password and email gets added to a backend
// 3. Check that email or username doesn't already exist
// 4. A logo