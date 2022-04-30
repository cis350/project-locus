/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Stack, Card } from 'react-bootstrap';
import '../assets/Club.css';
// import api functions instead
import {
  getUserId, getUserClubs, createClub, getSpecificClub, getUser,
} from '../modules/api';
import Profile from './Profile';

export default function Club({ club, setClub, userId, user }) {
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  // display all the members within the club by their emails
  const displayMembers = [];
  for (let i = 0; i < club.members.length; i += 1) {
    displayMembers.push(
      <div className="row" key={`member${i}`}>
        <Button className="project-button" onClick={() => setSelectedProfile(club.members[i])}>
          {club.members[i]}
        </Button>
      </div>,
    );
  }

  const displayProjects = [];
  for (let i = 0; i < club.projects.length; i += 1) {
    displayProjects.push(
      <div className="row" key={`project${i}`}>
        <Button className="project-button" onClick={() => console.log('open project')}>
          {club.projects[i]}
        </Button>
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
            {JSON.stringify(club)}
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
