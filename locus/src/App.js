import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Clubs from './components/Clubs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} username={username} />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/clubs" element={<Clubs />} />
      </Routes>
    </div>
  );
}

export default App;
