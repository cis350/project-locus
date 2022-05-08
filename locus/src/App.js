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
import ManageTasks from './components/ManageTasks';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [projectId, setProjectId] = useState(-1);
  const [uniqueId, setUniqueId] = useState('');
  const [currClubWithoutSpace, setCurrClubWithoutSpace] = useState('');
  const [currClub, setCurrClub] = useState('');
  const [currClubRole, setCurrClubRole] = useState('');
  const [currProjectWithoutSpace, setCurrProjectWithoutSpace] = useState('');
  const [currProject, setCurrProject] = useState('');

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} userId={uniqueId} userEmail={userEmail} />
      <Routes>
        <Route exact path="/" element={<Main justRegistered={justRegistered} setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/home/${uniqueId}`} element={<Home userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} />
        <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} setUniqueId={setUniqueId} />} />
        <Route exact path="/reset" element={<ResetPassword />} />
        <Route exact path="/register" element={<Register setJustRegistered={setJustRegistered} />} />
        <Route exact path={`/clubs/${uniqueId}`} element={<Clubs userEmail={userEmail} />} />
        <Route exact path={`/projects/select-projects/${uniqueId}`} element={<SelectProject setProjectId={setProjectId} />} />
        <Route exact path={`/projects/allprojects/${currClubWithoutSpace}/${uniqueId}`} element={<Project projectId={projectId} userId={uniqueId} email={userEmail} club={currClub} role={currClubRole} setCurrProject={setCurrProject} setCurrProjectWithoutSpace={setCurrProjectWithoutSpace} />} />
        <Route exact path={`/chats/${uniqueId}`} element={<Chat userEmail={userEmail} />} />
        <Route exact path={`/projects/manage-projects/${currProjectWithoutSpace}/analytics/${uniqueId}`} element={<Analytics userId={uniqueId} currProjectWithoutSpace={currProjectWithoutSpace} project={currProject} club={currClub} email={userEmail} />} />
        <Route exact path={`/projects/clubs/${uniqueId}`} element={<ProjectClubList userId={uniqueId} email={userEmail} setCurrClubWithoutSpace={setCurrClubWithoutSpace} setCurrClub={setCurrClub} setCurrClubRole={setCurrClubRole} />} />
        <Route exact path={`/projects/manage-projects/${currProjectWithoutSpace}/${uniqueId}`} element={<ManageProject email={userEmail} userId={uniqueId} club={currClub} project={currProject} role={currClubRole} currProjectWithoutSpace={currProjectWithoutSpace} />} />
        <Route exact path={`/projects/manage-projects/${currProjectWithoutSpace}/managetasks/${uniqueId}`} element={<ManageTasks project={currProject} club={currClub} email={userEmail} role={currClubRole} />} />
      </Routes>
    </div>
  );
}

export default App;
