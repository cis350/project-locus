import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Clubs from './components/Clubs';
import Home from './components/Home';
import ManageProject from './components/ManageProject';
import SelectProject from './components/SelectProject';
import Chat from './components/Chat';
import { getUserUniqueId } from './modules/storage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [projectId, setProjectId] = useState(-1);

  let uniqueId = '';
  if (isLoggedIn) {
    uniqueId = getUserUniqueId(userEmail);
  }

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} userEmail={userEmail} />
      <Routes>
        <Route exact path="/" element={<Main justRegistered={justRegistered} setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/home/${uniqueId}`} element={<Home userEmail={userEmail} />} />
        <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
        <Route exact path="/register" element={<Register setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/clubs/${uniqueId}`} element={<Clubs userEmail={userEmail} />} />
        <Route exact path={`/projects/select-projects/${uniqueId}`} element={<SelectProject setProjectId={setProjectId} />} />
        <Route exact path={`/projects/manage-projects/${uniqueId}`} element={<ManageProject projectId={projectId} />} />
        <Route exact path={`/chats/${uniqueId}`} element={<Chat userEmail={userEmail} />} />
      </Routes>
    </div>
  );
}

export default App;
