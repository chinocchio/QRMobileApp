import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.9:8000/api/student', {
        name, // Use 'name' instead of 'username'
        password,
      });
  
      if (response.status === 200) {
        navigation.navigate('QrScanner', { user: response.data });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join('\n');
        setError(errorMessage);
        Alert.alert('Validation Error', errorMessage);
      } else {
        setError('Failed to connect to the server');
        Alert.alert('Error', 'Failed to connect to the server');
      }
      console.error('Network request failed:', error);



    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
    </View>
  );
};

export default LoginScreen;
