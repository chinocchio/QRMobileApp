import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const QrScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned', `Scanned data: ${data}`);

    try {
      const response = await axios.post('http://192.168.1.9:8000/api/record-scan', {
        qr: data,
        scanned_by: "Tang Ina mo" , // Replace with dynamic user data if available
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Scan recorded successfully!');
      } else {
        Alert.alert('Error', 'Failed to record the scan');
      }
    } catch (error) {
      console.error('Error recording scan:', error);
      Alert.alert('Error', 'Failed to record the scan');
    }
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
