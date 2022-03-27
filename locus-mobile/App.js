/* eslint-disable object-curly-newline */
import React from 'react';
// import react navigation container
import { NavigationContainer } from '@react-navigation/native';
// import navigation stack constructor
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './components/Main';
import Login from './components/Login';

// create a navigation stack
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" >
        <Stack.Screen name="Main" component={Main} options={{ title: 'LOCUS' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navigation from './components/Navigation';
// import Main from './components/Main';
// import Login from './components/Login';
// import Register from './components/Register';
// import Clubs from './components/Clubs';
// import Home from './components/Home';
// import { getUserUniqueId } from './modules/storage';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [justRegistered, setJustRegistered] = useState(false);
//   let uniqueId = '';
//   if (isLoggedIn) {
//     uniqueId = getUserUniqueId(userEmail);
//   }

//   return (
//     <div>
//       <Navigation isLoggedIn={isLoggedIn} userEmail={userEmail} />
//       <Routes>
//         <Route exact path="/" element={<Main justRegistered={justRegistered} setJustRegistered={setJustRegistered} />} />
//         <Route exact path={`/home/${uniqueId}`} element={<Home userEmail={userEmail} />} />
//         <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
//         <Route exact path="/register" element={<Register setJustRegistered={setJustRegistered} />} />
//         <Route exact path={`/clubs/${uniqueId}`} element={<Clubs userEmail={userEmail} />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
