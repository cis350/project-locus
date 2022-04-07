import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/ClubManager.css';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, joinClub, getClub,
} from '../modules/storage';

function ClubManager({ userEmail, clubName }) {
  const currClub = getClub(clubName);
  const allMembers = currClub.members;

  return(
    <Container>
      <Button onClick={switchToClubs}>Go back</Button>
      <Stack>
        <div className="manager-view">
          {allMembers.map((member) => (
          
            <Row>
              <Col className="member-item" key={member}>
                <div className="member-name">
                  <p className="from-them">{member}</p>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      </Stack>
      <Form>
        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Input Message</Form.Label>
          <Form.Control id="input-text" type="message" placeholder="Send a message!" onChange={} />
        </Form.Group>
        <Button variant="primary" onClick={}> Send </Button>
      </Form>
    </Container>
  )

}

export default ClubManager;
