import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Clubs from './components/Clubs';

function App() {
  return (
    <>path="/login" element={<Login />} />
        <Route exact path="/registe
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/clubs" element={<Clubs />} />
      </Routes>
    </>
  );
}

export default App;
