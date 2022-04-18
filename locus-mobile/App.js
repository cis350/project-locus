import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Main from './components/Main';
import Login from './components/Login';
import Clubs from './components/Clubs';
import Club from './components/Club';
import Profile from './components/Profile';
import Navigation from './components/TabNavigation';

// create a navigation stack
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{ title: 'LOCUS' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="Clubs" component={Clubs} options={{ title: 'Clubs' }} />
        <Stack.Screen name="Club" component={Club} options={{ title: 'Club' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
        <Stack.Screen name="AppNavigation" component={Navigation} options={{ title: 'LOCUS', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
