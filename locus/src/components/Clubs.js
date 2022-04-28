import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/Clubs.css';
// import api functions instead
import {
  getUserId, getUserClubs, createClub, getSpecificClub,
} from '../modules/fetchRequests';

function Clubs({ userEmail }) {
  const [userClubs, setUserClubs] = useState([]);
  const masterId = useRef(undefined);
  const [newClubName, setClubName] = useState('');

  // get the user clubs as soon as the component is rendered
  useEffect(() => {
    async function initialize() {
      masterId.current = await getUserId(userEmail);
      setUserClubs(await getUserClubs(userEmail));
    }
    initialize();
  }, []);

  // // initial clubs user is in
  // const initState = [];
  // const userClubs = getUserClubs(userEmail);
  // for (let i = 0; i < userClubs.length; i += 1) {
  //   const club = getClub(userClubs[i]);
  //   const newClub = {
  //     clubItemName: userClubs[i],
  //     masterItemName: club.master,
  //   };
  //   initState.push(newClub);
  // }
  // const [clubsArray, addClub] = useState(initState);
  // const clubName = useRef('');
  // const masterName = useRef('');
  // const handleClubs = () => {
  //   // update to api's joinClub
  //   const clubValues = joinClub(userEmail, clubName.current, masterName.current);
  //   if (clubValues) {
  //     const newClub = {
  //       clubItemName: clubName.current,
  //       masterItemName: clubValues.master,
  //     };
  //     console.log('adding club now!');
  //     addClub([...clubsArray, newClub]);
  //   } else {
  //     alert('Club exists, wrong master');
  //   }
  // };

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
              <Button className="add-club-button" onClick={handleCreateClub}>
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
