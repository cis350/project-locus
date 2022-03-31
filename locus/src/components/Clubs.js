import React, { useState, useRef } from 'react';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, joinClub, getClub,
} from '../modules/storage';
import { v4 as uuidv4 } from 'uuid';

function Clubs({ userEmail }) {
  // initial clubs user is in
  const initState = [];
  const userClubs = getUserClubs(userEmail);
  for (let i = 0; i < userClubs.length; i++) {
    const club = getClub(userClubs[i]);
    const newClub = {
      clubItemName: userClubs[i],
      masterItemName: club.master,
    };
    initState.push(newClub);
  }
  const [clubsArray, addClub] = useState(initState);

  const clubName = useRef('');
  const masterName = useRef('');

  const handleClubs = () => {
    const clubValues = joinClub(userEmail, clubName.current, masterName.current, uuidv4())
    if (clubValues){
      const newClub = {
        clubItemName: clubName.current,
        masterItemName: masterName.current,
      };
      addClub([...clubsArray, newClub]);
    } else {
      alert('Club exists, wrong master');
    }
  };

  const makeClubName = (e) => {
    clubName.current = e.target.value;
  };

  const makeMasterName = (e) => {
    masterName.current = e.target.value;
  };

  return (
    <div>
      <Container fluid>
        <Stack gap={20}>
          <Row>
            <h1 className="club-header">
              Which Club Needs Work, &nbsp;
              {getUserFullName(userEmail)}
              ?
            </h1>
          </Row>
          <div className="club-table">
            {clubsArray.map((clubItem) => (
              <div className="club-item" key={clubItem.clubItemName}>
                <Button className="club-button">
                  <Row>
                    <Col className="d-flex justify-content-center">
                      {clubItem.clubItemName}
                    </Col>
                    <Col className="d-flex justify-content-center">
                      Master: &nbsp;
                      {clubItem.masterItemName}
                    </Col>
                    <Col className="d-flex justify-content-center">
                      Settings
                    </Col>
                  </Row>
                </Button>
              </div>
            ))}
          </div>
          <div className="add-club-form">
            <Row>
              <Form className="club-form">
                <input type="text" onChange={makeClubName} placeholder="Club name" />
              </Form>
              <Form className="club-form">
                <input type="text" onChange={makeMasterName} placeholder="Clubmaster name" />
              </Form>
              <Button className="add-club-button" onClick={handleClubs}>
                Add Club
              </Button>
            </Row>
          </div>
        </Stack>
      </Container>
    </div>
  );
}

export default Clubs;
