import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'black',
  }
});


// const Navigation = function NavigationComponent({ isLoggedIn, userEmail }) {
//   // link to home if the user is logged in
//   const mainForLoggedInUser = (() => (
//     <div>
//       <Link to={`/home/${getUserUniqueId(userEmail)}`} className="navbar-brand">
//         <Button id="logoNav-button" className="navbar-button">
//           Locus
//         </Button>
//       </Link>
//       <Link to={`/home/${getUserUniqueId(userEmail)}`} className="navbar-brand">
//         <Button className="navbar-button">
//           Home
//         </Button>
//       </Link>
//       <Link to={`/chats/${getUserUniqueId(userEmail)}`} className="navbar-brand">
//         <Button className="navbar-button">
//           Chats
//         </Button>
//       </Link>
//       <Link to={`/clubs/${getUserUniqueId(userEmail)}`} className="navbar-brand">
//         <Button className="navbar-button">
//           Club
//         </Button>
//       </Link>
//       <Link to={`/projects/${getUserUniqueId(userEmail)}`} className="navbar-brand">
//         <Button className="navbar-button">
//           Projects
//         </Button>
//       </Link>
//     </div>
//   ));

//   // link to log-in if the user is not logged in
//   const mainForNonLoggedInUser = (() => (
//     <div>
//       <Link to="/" className="navbar-brand">
//         <Button id="logoNav-button" className="navbar-button">
//           Locus
//         </Button>
//       </Link>
//     </div>
//   ));

//   return (
//     // referenced https://react-bootstrap.github.io/components/navbar/
//     <Navbar>
//       <Container>
//         {isLoggedIn ? mainForLoggedInUser() : mainForNonLoggedInUser()}
//       </Container>
//     </Navbar>
//   );
// };
