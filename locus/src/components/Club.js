/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Stack, Card } from 'react-bootstrap';
import '../assets/Club.css';
// import api functions instead
import { promoteMember, removeMember } from '../modules/api';
import Profile from './Profile';

export default function Club({ club, setClub, userId, user }) {
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  const navigate = useNavigate();

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

  async function handleViewProject(project) {
    navigate(`/projects/manage-projects/${project}/${userId}`);
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
        <Button className="project-button" onClick={() => handleViewProject(club.projects[i])}>
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
            idk
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