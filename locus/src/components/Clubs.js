import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Form, Container, Row, Col, Stack, Card,
} from 'react-bootstrap';
import '../assets/Clubs.css';
// import api functions instead
import {
  getUserId, getUserClubs, createClub, getSpecificClub, getUser,
} from '../modules/api';
import Club from './Club';

function Clubs({ userEmail }) {
  const masterId = useRef(undefined);
  const user = useRef(undefined);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(undefined);
  const [newClubName, setClubName] = useState('');
  const [clubPassword, setClubPassword] = useState('');

  // get the user clubs as soon as the component is rendered
  useEffect(() => {
    async function initialize() {
      masterId.current = (await getUserId(userEmail)).jsonContent;
      user.current = await getUser(userEmail);
      setUserClubs((await getUserClubs(userEmail)).jsonContent);
    }
    initialize();
  }, []);

  // create club with the fields in clubname and clubpassword
  async function handleCreateClub() {
    await createClub(newClubName, masterId.current, clubPassword);
    setUserClubs((await getUserClubs(userEmail)).jsonContent);
    setClubName('');
    setClubPassword('');
  }

  // set a specific club which will prompt rerender to load the club page
  async function loadClubPage(clubName) {
    setSelectedClub((await getSpecificClub(clubName)).jsonContent);
  }

  // setup all the clubs that the user is a part of for display
  const displayClubs = [];
  for (let i = 0; i < userClubs.length; i += 1) {
    displayClubs.push(
      <div className="club-item" key={userClubs[i].clubName}>
        <Button className="club-button" onClick={() => loadClubPage(userClubs[i].clubName)}>
          <Row>
            <Col className="d-flex justify-content-center">
              {userClubs[i].clubName}
            </Col>
            <Col className="d-flex justify-content-center">
              Role: &nbsp;
              {userClubs[i].role}
            </Col>
            <Col className="d-flex justify-content-center">
              Settings
            </Col>
          </Row>
        </Button>
      </div>,
    );
  }

  // component to return
  if (selectedClub) {
    return (
      <Club club={selectedClub} setClub={setSelectedClub} userId={masterId.current} user={user} />
    );
  }
  if (!user.current) return <div>404 User Not Found</div>;
  return (
    <div>
      <Container fluid>
        <Stack gap={20}>
          <Row>
            <h1 className="club-header">
              Which Club Needs Work, &nbsp;
              {user.current.firstName}
              ?
            </h1>
          </Row>
          <div className="club-table">
            {displayClubs}
          </div>
          <Card style={{
            width: '23rem',
            margin: 'auto',
            marginTop: '20px',
            borderRadius: '10px',
            backgroundColor: '#B5E48C',
            borderColor: '#B5E48C',
          }}
          >
            <Card.Body>
              {/* referenced https://react-bootstrap.github.io/forms/overview/ */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Club Name</Form.Label>
                  <Form.Control style={{ height: '35px' }} type="name" onChange={(e) => setClubName(e.target.value)} />
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    style={{ height: '35px' }}
                    type="password"
                    maxLength="20"
                    onChange={(e) => setClubPassword(e.target.value)}
                  />
                  <br />
                  <Button className="btn btn-success" onClick={() => handleCreateClub()}>
                    Add Club
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}

export default Clubs;
