import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QrScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      // Retrieve the user's name from AsyncStorage
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name); // Assuming the user object has a 'name' property
        console.log(`User logged in: ${userData.name}`);
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned', `Scanned data: ${data}`);
    console.log(`QR Code Scanned: ${data}`);

    try {
      // Get the device's IP and location
      const deviceIpResponse = await axios.get('https://api.ipify.org?format=json');
      const deviceIp = deviceIpResponse.data.ip;
      console.log(`Device IP: ${deviceIp}`);

      // Replace with your IPregistry or other service API key
      const apiKey = 'pid2gc6x3r0bw739';
      const locationResponse = await axios.get(`https://api.ipregistry.co/${deviceIp}?key=${apiKey}`);
      const deviceLocation = locationResponse.data.location;
      console.log(`Device Location: Lat: ${deviceLocation.latitude}, Lon: ${deviceLocation.longitude}`);

      // Define the target location (near 122.3.156.198)
      const targetLatitude = 13.405642;
      const targetLongitude = 123.377085;
      const maxDistance = 500; // 500 meters as an example

      // Calculate the distance between two locations
      const distance = calculateDistance(
        targetLatitude,
        targetLongitude,
        deviceLocation.latitude,
        deviceLocation.longitude
      );

      console.log(`Distance to target: ${distance} meters`);

      if (distance <= maxDistance) {
        // The device is within the acceptable range
        console.log('Device is within the acceptable range, recording scan...');
        const response = await axios.post('http://192.168.1.11:8000/api/record-scan', {
          qr: data,
          scanned_by: userName, // Use the logged-in user's name
        });

        if (response.status === 201) {
          Alert.alert('Success', 'Scan recorded successfully!');
          console.log('Scan recorded successfully');
        } else {
          Alert.alert('Error', 'Failed to record the scan');
          console.error('Failed to record the scan');
        }
      } else {
        Alert.alert('Error', 'You are not in the correct location to scan this QR code.');
        console.warn('Device is not in the correct location');
      }
    } catch (error) {
      console.error('Error recording scan:', error);
      Alert.alert('Error', 'Failed to record the scan');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default QrScannerScreen;
