/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../assets/Club.css';
// import api functions instead
import { promoteMember, removeMember, getAllClubTasks } from '../modules/api';
import Profile from './Profile';

export default function Club({ club, setClub, userId, user }) {
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function initialize() {
      setTasks((await getAllClubTasks(club.clubName)).jsonContent);
    }
    initialize();
  }, []);
  // promote member in the club
  async function handlePromoteMember(memberEmail) {
    const response = await promoteMember(club.clubName, user.email, memberEmail);
    if (response.status === 200) alert('Promotion Success');
    if (response.status !== 200) alert('Promotion Failed');
  }

  // promote member in the club
  async function handleRemoveMember(memberEmail) {
    const response = await removeMember(club.clubName, user.email, memberEmail);
    if (response.status === 200) alert('Removal Success');
    if (response.status !== 200) alert('Removal Failed');
    setClub(undefined);
  }

  // display all the members within the club by their emails
  const displayMembers = [];
  for (let i = 0; i < club.members.length; i += 1) {
    displayMembers.push(
      <div className="row" key={`member${i}`}>
        <div className="col-6">
          <button type="button" className="btn member-button" onClick={() => setSelectedProfile(club.members[i])}>
            {club.members[i]}
          </button>
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-danger marg-top-10" onClick={() => handleRemoveMember(club.members[i])}>
            Remove
          </button>
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-primary marg-top-10" onClick={() => handlePromoteMember(club.members[i])}>
            Promote
          </button>
        </div>
      </div>,
    );
  }

  // setup the display for all the club projects
  const displayProjects = [];
  for (let i = 0; i < club.projects.length; i += 1) {
    displayProjects.push(
      <div className="row" key={`project${i}`}>
        {club.projects[i]}
      </div>,
    );
  }

  const displayTasks = [];
  for (let i = 0; i < tasks.length; i += 1) {
    displayTasks.push(
      <div className="row" key={`task${i}`}>
        {tasks[i].tasks.taskName}
      </div>,
    );
  }

  // if selected profile, return profile view
  if (selectedProfile) {
    return (
      <div>
        <Profile userEmail={selectedProfile} />
        <div className="d-flex justify-content-center">
          <Button className="btn btn-danger" onClick={() => setSelectedProfile(undefined)}>
            Return
          </Button>
        </div>
      </div>
    );
  }

  // return main club view
  return (
    <div className="container">
      <Button className="btn btn-success" onClick={() => setClub(undefined)}>
        View All Clubs
      </Button>
      <br />
      <h1>Welcome to {club.clubName}!</h1>
      <div className="row">
        <div className="col-4">
          <h2>Members</h2>
          <div className="container section-container">
            {displayMembers}
          </div>
        </div>
        <div className="col-4">
          <h2>Tasks Assigned</h2>
          <div className="container section-container">
            {displayTasks}
          </div>
        </div>
        <div className="col-4">
          <h2>Projects</h2>
          <div className="container section-container">
            {displayProjects}
          </div>
        </div>
      </div>
    </div>
  );
}
