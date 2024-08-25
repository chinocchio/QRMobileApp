import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScanningChoiceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Scanning Method</Text>
      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('QrScanner')}
      />
      <Button
        title="Scan with User ID"
        onPress={() => navigation.navigate('QrScanWithUser')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ScanningChoiceScreen;
