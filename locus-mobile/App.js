import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Main from './components/Main';
import Login from './components/Login';
import Navigation from './components/Navigation';

// create a navigation stack
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{ title: 'LOCUS' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="AppNavigation" component={Navigation} options={{ title: 'LOCUS', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
