import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Clubs from './components/Clubs';
import Home from './components/Home';
import Project from './components/Project';
import SelectProject from './components/SelectProject';
import Chat from './components/Chat';
import ResetPassword from './components/ResetPassword';
import Analytics from './components/Analytics';
import ProjectClubList from './components/ProjectClubList';
import ManageProject from './components/ManageProject';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [projectId, setProjectId] = useState(-1);
  const [uniqueId, setUniqueId] = useState('');
  const [currClubWithoutSpace, setCurrClubWithoutSpace] = useState('');
  const [currClub, setCurrClub] = useState('');
  const [currClubRole, setCurrClubRole] = useState('');
  const [currProject, setCurrProject] = useState('');

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} userId={uniqueId} />
      <Routes>
        <Route exact path="/" element={<Main justRegistered={justRegistered} setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/home/${uniqueId}`} element={<Home userEmail={userEmail} />} />
        <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} setUniqueId={setUniqueId} />} />
        <Route exact path="/reset" element={<ResetPassword />} />
        <Route exact path="/register" element={<Register setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/clubs/${uniqueId}`} element={<Clubs userEmail={userEmail} />} />
        <Route exact path={`/projects/select-projects/${uniqueId}`} element={<SelectProject setProjectId={setProjectId} />} />
        <Route exact path={`/projects/allprojects/${currClubWithoutSpace}/${uniqueId}`} element={<Project projectId={projectId} userId={uniqueId} email={userEmail} club={currClub} role={currClubRole} setCurrProject={setCurrProject} />} />
        <Route exact path={`/chats/${uniqueId}`} element={<Chat userEmail={userEmail} />} />
        <Route exact path={`/projects/manage-projects/analytics/${uniqueId}`} element={<Analytics userId={uniqueId} />} />
        <Route exact path={`/projects/clubs/${uniqueId}`} element={<ProjectClubList userId={uniqueId} email={userEmail} setCurrClubWithoutSpace={setCurrClubWithoutSpace} setCurrClub={setCurrClub} setCurrClubRole={setCurrClubRole} />} />
        <Route exact path={`/projects/manage-projects/${currProject}/${uniqueId}`} element={<ManageProject userId={uniqueId} club={currClub} project={currProject} />} />
      </Routes>
    </div>
  );
}

export default App;
