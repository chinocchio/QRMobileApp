import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.11:8000/api/student', {
        name,
        password,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.navigate('ScanningChoice'); // Navigate to the choice screen
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
    }
  };

  return (
    <View style={styles.container}>
      <Text>Username</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
