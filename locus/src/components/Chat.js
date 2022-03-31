import React, { useState, useRef } from 'react';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, getClubChats, sendMessage, getClub,
} from '../modules/storage';

function Chat({ userEmail }) {
  // initial clubs user is in
  const allClubs = [];
  const userClubs = getUserClubs(userEmail);
  for (let i = 0; i < userClubs.length; i++) {
    const club = getClub(userClubs[i]);
    allClubs.push(club.clubName);
  }
  const [clubsArray, addClub] = useState(allClubs);
  const [currentChat, changeChat] = useState([]);
  const [showChat, changeShowChat] = useState(false);
  const message = useRef('');
  
  const handleClubs = (e) => {
    changeChat(e.target.value);
  }

  const switchToChat = () => {
    changeShowChat(!showChat);
  }

  const parseInput = (e) => {
    message.current = e.target.value;
  }

  const showAllClubs = (() => (
    <div>
      <Stack gap={20}>
        <Row>
        <h1 className="chat-header">
          Your Chats &nbsp;
        </h1>
        </Row>
        <div className="chat-table">
          {clubsArray.map((clubName) => (
            <div className="chat-item" key={clubName}>
              <Button className="chat-button" onClick={switchToChat}>
                <Row>
                  <Col className="d-flex justify-content-center">
                    {clubName}
                  </Col>
                </Row>
              </Button>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  ));

  const showAChat = (() => (
    <Container>
      <Button onClick={switchToChat}>Go back</Button>
      <div className="messages-table">
          {currentChat.map((message) => (
            <div className="chat-item" key={clubName}>
              <Button className="chat-button" onClick={switchToChat}>
                <Row>
                  <Col className="d-flex justify-content-center">
                    {clubName}
                  </Col>
                </Row>
              </Button>
            </div>
          ))}
        </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Send a messenger!" /> b 
        </Form.Group>
        <Button variant="primary" type="submit" onClick={parseInput}>
          Send
        </Button>
      </Form>
    </Container>
  ));

  return (
    <div>
      <Container>
        {showChat ? showAChat() : showAllClubs()}
      </Container>
    </div>
  );
}

export default Chat;
