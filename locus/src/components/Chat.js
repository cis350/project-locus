import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, Form, Container, Row, Col, Stack,
} from 'react-bootstrap';
import '../assets/Clubs.css';
import {
  getUserFullName, getUserClubs, getClubChat, sendMessage,
} from '../modules/storage';
import '../assets/Chat.css';

function Chat({ userEmail }) {
  const [currentChat, changeChat] = useState([]);
  const currentClub = useRef('');
  const message = useRef('');
  // clubs user is in
  const userClubs = getUserClubs(userEmail);
  // const stackElement = document.getElementsByClassName('chat-stack-scrollable')[0];
  // stackElement.scrollTop = stackElement.scrollHeight;

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
      sendMessage(currentClub.current, userEmail, message.current, new Date(), uuidv4());
    }
    const updatedChat = getClubChat(currentClub.current);
    message.current = '';
    document.getElementById('input-text').value = '';
    // stackElement.scrollTop = stackElement.scrollHeight;
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
      <Stack>
        <div className="chat-stack-scrollable">
          {currentChat.map((mess) => (
            <Row>
              <Col className="chat-item" key={mess[3]}>
                <div className="imessage">
                  <p className="from-them">{mess[1]}</p>
                </div>
                <p>
                  {getUserFullName(mess[0])}
                  :
                  {mess[2].toString()}
                </p>
              </Col>
            </Row>
          ))}
        </div>
      </Stack>
      <Form>
        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Input Message</Form.Label>
          <Form.Control id="input-text" type="message" placeholder="Send a message!" onChange={parseInput} />
        </Form.Group>
        <Button variant="primary" onClick={submitMessage}> Send </Button>
      </Form>
    </Container>
  ));

  return (
    <div>
      <Container>
        {(currentClub.current === '') ? showAllClubs() : showAChat() }
      </Container>
    </div>
  );
}

export default Chat;
