import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, getClubChat, sendMessage,
} from '../modules/storage';

function Chat({ userEmail }) {
  const [currentChat, changeChat] = useState([]);
  const currentClub = useRef('');
  const message = useRef('');
  // clubs user is in
  const userClubs = getUserClubs(userEmail);

  const switchToChat = (clubName) => {
    currentClub.current = clubName;
    changeChat(getClubChat(clubName));
  };

  const switchToClubs = () => {
    currentClub.current = '';
    changeChat([]);
  };

  const parseInput = (e) => {
    message.current = e.target.value;
  };

  const submitMessage = () => {
    if (/\S/.test(message.current)) {
      sendMessage(currentClub.current, userEmail, message.current, Date.now(), uuidv4());
    }
    const updatedChat = getClubChat(currentClub.current);
    changeChat(updatedChat);
  };

  const showAllClubs = (() => (
    <div>
      <Stack gap={20}>
        <Row>
          <h1 className="chat-header">
            Your Chats &nbsp;
          </h1>
        </Row>
        <div className="chat-table">
          {userClubs.map((clubName) => (
            <div className="club-item" key={clubName}>
              <Button className="club-button" onClick={() => switchToChat(clubName)}>
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
      <Button onClick={switchToClubs}>Go back</Button>
      <div className="messages-table">
        {currentChat.map((mess) => (
          <div className="chat-item" key={mess[3]}>
            <p>
              {mess[2]}
              :
              {getUserFullName(mess[0])}
              :
            </p>
            {mess[1]}
          </div>
        ))}
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Input Message</Form.Label>
          <Form.Control type="message" placeholder="Send a message!" onChange={parseInput} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={submitMessage}> Send </Button>
      </Form>
    </Container>
  )
  );

  return (
    <div>
      <Container>
        {(currentClub.current === '') ? showAllClubs() : showAChat() }
      </Container>
    </div>
  );
}

export default Chat;
