import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import QrScannerScreen from './screens/QrScannerScreen';
import QrScanWithUserScreen from './screens/QrScanWithUserScreen';
import ScanningChoiceScreen from './screens/ScanningChoiceScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} />
        <Stack.Screen name="QrScanWithUser" component={QrScanWithUserScreen} />
        <Stack.Screen name="ScanningChoice" component={ScanningChoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}