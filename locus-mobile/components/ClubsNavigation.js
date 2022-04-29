import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Clubs from './Clubs';
import Club from './Club';
import Profile from './Profile';

// navigation for all the pages reachable from the club tab
const ClubStack = createNativeStackNavigator();
export default function ClubsNavigation({ route }) {
  const { user } = route.params;
  return (
    <NavigationContainer independent>
      <ClubStack.Navigator initialRouteName="Clubs">
        <ClubStack.Screen name="Clubs" component={Clubs} options={{ title: 'Clubs' }} initialParams={{ user }} />
        <ClubStack.Screen name="Club" component={Club} options={{ title: 'Club' }} initialParams={{ user }} />
        <ClubStack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} initialParams={{ user }} />
      </ClubStack.Navigator>
    </NavigationContainer>
  );
}
