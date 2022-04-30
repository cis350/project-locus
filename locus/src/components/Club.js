/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Form, Container, Row, Col, Stack, Card } from 'react-bootstrap';
import '../assets/Clubs.css';
// import api functions instead
import {
  getUserId, getUserClubs, createClub, getSpecificClub, getUser,
} from '../modules/api';

export default function Club({ club, setClub, userId, user }) {
  return (
    <Container fluid>
      <Button className="btn btn-success" onClick={() => setClub(undefined)}>
        View All Clubs
      </Button>
      {JSON.stringify(club)}
    </Container>
  );
}
