import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import AllChats from './AllChats';
import ClubsNavigation from './ClubsNavigation';
import ProjectClubsList from './ProjectClubsList';

const Tab = createBottomTabNavigator();
export default function Navigation({ route }) {
  const { user } = route.params;
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ user }}
        options={{
          tabBarIcon: (tabInfo) => (
            <Ionicons
              name="home-outline"
              size={24}
              color={tabInfo.focused ? '#006600' : '#8e8e93'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={AllChats}
        initialParams={{ user }}
        options={{
          tabBarIcon: (tabInfo) => (
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={tabInfo.focused ? '#006600' : '#8e8e93'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubsNavigation}
        initialParams={{ user }}
        options={{
          tabBarIcon: (tabInfo) => (
            <Ionicons
              name="people-outline"
              size={24}
              color={tabInfo.focused ? '#006600' : '#8e8e93'}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectClubsList}
        initialParams={{ user }}
        options={{
          tabBarIcon: (tabInfo) => (
            <Ionicons
              name="create-outline"
              size={24}
              color={tabInfo.focused ? '#006600' : '#8e8e93'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
