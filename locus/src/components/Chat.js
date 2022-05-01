import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Form, Container, Row, Col, Stack, Alert,
} from 'react-bootstrap';
import '../assets/Clubs.css';
// import from api functions instead
import {
  getUserClubs, getClubChat, sendMessage,
} from '../modules/api';
import '../assets/Chat.css';

function Chat({ userEmail }) {
  const [currentChat, changeChat] = useState([]);
  const [sendFail, changeSendFail] = useState(false);
  const [clubsFail, changeClubsFail] = useState(false);
  const [chatsFail, changeChatsFail] = useState(false);
  const currentClub = useRef('');
  const message = useRef('');
  // clubs user is in
  const userClubs = useRef(null);

  if (userClubs.current === null) {
    getUserClubs(userEmail).then((res) => {
      if (res.status === 200) {
        changeClubsFail(false);
        userClubs.current = res.jsonContent.clubsArray;
      } else {
        changeClubsFail(true);
      }
    });
  }

  const switchToChat = (clubName) => {
    currentClub.current = clubName;
    getClubChat(clubName).then((res) => {
      if (res.status === 200) {
        changeChatsFail(false);
        changeChat(res.jsonContent.clubObject);
      } else {
        changeChatsFail(true);
      }
    });
  };

  const switchToClubs = async () => {
    currentClub.current = '';
    changeChat([]);
  };

  const parseInput = (e) => {
    message.current = e.target.value;
  };

  const submitMessage = () => {
    if (/\S/.test(message.current)) {
      sendMessage(currentClub.current, userEmail, message.current, new Date()).then((res) => {
        if (res.status === 200) {
          changeSendFail(false);
          getClubChat(currentClub.current).then((resp) => {
            if (resp.status === 200) {
              changeChatsFail(false);
              message.current = '';
              document.getElementById('input-text').value = '';
              changeChat(resp.jsonContent.clubObject);
            } else {
              changeChatsFail(true);
            }
          });
        } else {
          changeSendFail(true);
        }
      });
    }
  };

  if (currentClub.current !== '') {
    useEffect(
      () => {
        async function fetchMessages() {
          // update with thens
          getClubChat(currentClub.current).then((resp) => {
            if (resp.status === 200) {
              changeChatsFail(false);
              changeChat(resp.jsonContent.clubObject);
            } else {
              changeChatsFail(true);
            }
          });
        }

        setInterval(() => {
          fetchMessages();
        }, 5000);
      },
      [currentChat],
    );
  }

  const errorSendMessage = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Message failed to send.
    </Alert>
  ));

  const errorGetClubs = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Failed to get clubs.
    </Alert>
  ));

  const errorGetChats = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Failed to get messages.
    </Alert>
  ));

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
      {clubsFail && errorGetClubs}
    </div>
  ));

  const showAChat = (() => (
    <Container>
      <Button onClick={switchToClubs}>Go back</Button>
      <Stack>
        {chatsFail && errorGetChats}
        <div className="chat-stack-scrollable">
          {currentChat.map((mess) => (
            <Row>
              <Col className="chat-item" key={mess[3]}>
                <div className="imessage">
                  <p className="from-them">{mess[1]}</p>
                </div>
                <p>
                  {mess[0]}
                  :
                  {mess[2].toString()}
                </p>
              </Col>
            </Row>
          ))}
        </div>
      </Stack>
      {sendFail && errorSendMessage}
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
