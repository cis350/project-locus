import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Form, Container, Row, Col, Stack, Card,
} from 'react-bootstrap';
import '../assets/Clubs.css';
// import api functions instead
import {
  getUserId, getUserClubs, createClub, getSpecificClub, getUser, joinClub,
} from '../modules/api';
import Club from './Club';

function Clubs({ userEmail }) {
  const masterId = useRef(undefined);
  const user = useRef(undefined);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(undefined);
  const [newClubName, setNewClubName] = useState('');
  const [newClubPassword, setNewClubPassword] = useState('');
  const [joinClubName, setJoinClubName] = useState('');
  const [joinClubPassword, setJoinClubPassword] = useState('');

  // get the user clubs as soon as the component is rendered
  useEffect(() => {
    async function initialize() {
      masterId.current = (await getUserId(userEmail)).jsonContent;
      user.current = await getUser(userEmail);
      setUserClubs((await getUserClubs(userEmail)).jsonContent);
    }
    initialize();
  }, []);

  // create club with the fields in newClubName and newClubPassword
  async function handleCreateClub() {
    const response = await createClub(newClubName, masterId.current, newClubPassword);
    setUserClubs((await getUserClubs(userEmail)).jsonContent);
    setNewClubName('');
    setNewClubPassword('');
    console.log(response);
    if (response.status !== 200) alert('Create Club Failed');
  }

  // join club with the fields in joinClubName and joinClubPassword
  async function handleJoinClub() {
    const response = await joinClub(joinClubName, userEmail, joinClubPassword);
    setUserClubs((await getUserClubs(userEmail)).jsonContent);
    setJoinClubName('');
    setJoinClubPassword('');
    if (response.status !== 201) alert('Join Club Failed');
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

  // intermediate loading screen while states are being fetched
  if (!user.current) return <div>Loading...</div>;

  // if a club is selected return the view page for that club
  if (selectedClub) {
    return (
      <Club
        club={selectedClub}
        setClub={setSelectedClub}
        userId={masterId.current}
        user={user.current}
      />
    );
  }
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
          <div className="row justify-content-center">
            {/* Create Clubs Form */}
            <div className="col-4">
              <h3 style={{ textAlign: 'center' }}>Create Club</h3>
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
                      <Form.Control style={{ height: '35px' }} type="name" value={newClubName} onChange={(e) => setNewClubName(e.target.value)} />
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        style={{ height: '35px' }}
                        type="password"
                        maxLength="20"
                        value={newClubPassword}
                        onChange={(e) => setNewClubPassword(e.target.value)}
                      />
                      <br />
                      <Button className="btn btn-success" onClick={() => handleCreateClub()}>
                        Add Club
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>

            {/* Join Clubs Form */}
            <div className="col-4">
              <h3 style={{ textAlign: 'center' }}>Join Club</h3>
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
                      <Form.Control style={{ height: '35px' }} type="name" value={joinClubName} onChange={(e) => setJoinClubName(e.target.value)} />
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        style={{ height: '35px' }}
                        type="password"
                        maxLength="20"
                        value={joinClubPassword}
                        onChange={(e) => setJoinClubPassword(e.target.value)}
                      />
                      <br />
                      <Button className="btn btn-success" onClick={() => handleJoinClub()}>
                        Join Club
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}

export default Clubs;
