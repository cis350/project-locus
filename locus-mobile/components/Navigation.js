import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
export default function Navigation() {
  return (
    <Tab.Navigator initialRouteName='Home' >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: (tabInfo) => ( 
            <Ionicons
              name="home-outline"
              size={24}
              color={tabInfo.focused ? "#006600" : "#8e8e93"}
            />)
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={() => <Text>Chat</ Text>} 
        options={{
          tabBarIcon: (tabInfo) => ( 
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={tabInfo.focused ? "#006600" : "#8e8e93"}
            />)
        }} 
      />
      <Tab.Screen 
        name="Clubs" 
        component={() => <Text>Clubs</ Text>} 
        options={{
          tabBarIcon: (tabInfo) => ( 
            <Ionicons
              name="people-outline"
              size={24}
              color={tabInfo.focused ? "#006600" : "#8e8e93"}
            />)
        }} 
      />
      <Tab.Screen 
        name="Projects" 
        component={() => <Text>Projects</ Text>} 
        options={{
          tabBarIcon: (tabInfo) => ( 
            <Ionicons
              name="create-outline"
              size={24}
              color={tabInfo.focused ? "#006600" : "#8e8e93"}
            />)
        }} 
      />
    </Tab.Navigator>
  )
}

