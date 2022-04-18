import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Clubs from './Clubs';
import Club from './Club';
import Profile from './Profile';

const ClubStack = createNativeStackNavigator();
export default function ClubsNavigation() {
  return (
    <NavigationContainer independent>
      <ClubStack.Navigator initialRouteName="Clubs">
        <ClubStack.Screen name="Clubs" component={Clubs} options={{ title: 'Clubs' }} />
        <ClubStack.Screen name="Club" component={Club} options={{ title: 'Club' }} />
        <ClubStack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      </ClubStack.Navigator>
    </NavigationContainer>
  );
}
