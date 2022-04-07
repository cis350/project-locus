import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, Form, Container, Row, Col, Stack, Link,
} from 'react-bootstrap';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, joinClub, getClub, getClubUniqueId, getUserUniqueId,
} from '../modules/storage';

function Clubs({ userEmail, clubStateUpdater }) {
  // initial clubs user is in
  const initState = [];
  const userClubs = getUserClubs(userEmail);
  for (let i = 0; i < userClubs.length; i += 1) {
    const club = getClub(userClubs[i]);
    const newClub = {
      clubItemName: userClubs[i],
      masterItemName: club.master,
    };
    initState.push(newClub);
  }
  // array of club names
  const [clubsArray, addClub] = useState(initState);

  const clubName = useRef('');
  const masterName = useRef('');

  // makes new clubs
  const handleClubs = () => {
    const newClubUid = uuidv4();
    const clubValues = joinClub(userEmail, clubName.current, masterName.current, newClubUid);
    if (clubValues) {
      const newClub = {
        clubItemName: clubName.current,
        masterItemName: clubValues.master,
      };
      console.log('adding club now!');
      addClub([...clubsArray, newClub]);
    } else {
      alert('Club exists, wrong master');
    }
  };

  // helpers
  const makeClubName = (e) => {
    clubName.current = e.target.value;
  };

  const makeMasterName = (e) => {
    masterName.current = e.target.value;
  };

  // passes clubName back to app via react state
  const reportClubClicked = (clubNameClicked) => {
    clubStateUpdater(clubNameClicked);
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
                <Link to={`/clubs/${getUserUniqueId(userEmail)}/${getClubUniqueId(clubItem.clubItemName)}`}>
                  {/* Modifies currClub in app to route properly */}
                  <Button className="club-button" onClick={reportClubClicked(clubItem.clubItemName)}>
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
                </Link>
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
