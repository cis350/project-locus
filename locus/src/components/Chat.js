import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Form, Container, Row, Col, Stack, Alert,
} from 'react-bootstrap';
import '../assets/Clubs.css';
// import from api functions instead
import {
  getUserClubs, getClubChat, sendMessage, updateNotifications,
} from '../modules/api';
import '../assets/Chat.css';

function Chat({ userEmail }) {
  const [currentChat, changeChat] = useState([]);
  const [userClubs, changeUserClubs] = useState([]);
  const [sendFail, changeSendFail] = useState(false);
  const [clubsFail, changeClubsFail] = useState(false);
  const [chatsFail, changeChatsFail] = useState(false);
  const currentClub = useRef('');
  const message = useRef('');
  const content = useRef('');

  if (userClubs.length === 0) {
    getUserClubs(userEmail).then((res) => {
      if (res.status === 200) {
        changeClubsFail(false);
        changeUserClubs(res.jsonContent);
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
        changeChat(res.jsonContent);
        /// update in api
        updateNotifications(userEmail, currentClub.current).then((resp) => {
          if (resp.status === 200) {
            console.log('updated notifications');
          }
        });
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

  const parseContent = (e) => {
    content.current = e.target.value;
  };

  const submitMessage = () => {
    if (/\S/.test(message.current)) {
      sendMessage(
        currentClub.current,
        userEmail,
        message.current,
        content.current,
        (new Date()).getTime(),
      )
        .then((res) => {
          if (res.status === 201) {
            changeSendFail(false);
            getClubChat(currentClub.current).then((resp) => {
              if (resp.status === 200) {
                changeChatsFail(false);
                message.current = '';
                content.current = '';
                document.getElementById('input-text').value = '';
                document.getElementById('content-text').value = '';
                changeChat(resp.jsonContent);
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

  useEffect(
    () => {
      const intervalId = setInterval(() => {
        if (currentClub.current !== '') {
          getClubChat(currentClub.current).then((resp) => {
            if (resp.status === 200) {
              changeChatsFail(false);
              changeChat(resp.jsonContent);
            } else {
              changeChatsFail(true);
            }
          });
        }
      }, 5000);

      return () => clearInterval(intervalId);
    },
    [currentChat],
  );

  const isValidUrl = (url) => {
    try {
      const f = new URL(url);
      if (f) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return true;
  };

  const displayContent = (image) => {
    if (image === '' || !isValidUrl(image)) {
      return false;
    }
    return true;
  };

  const getDate = ((dateMilli) => {
    const date = new Date(dateMilli);
    const year = date.getFullYear();
    const month = ((date.getMonth() + 1)).slice(-2);
    const day = (date.getDate()).slice(-2);
    return `${month}-${day}-${year}`;
  });

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

  const showClubs = (() => (
    <div>
      <Stack gap={20}>
        <Row>
          <h1 className="chat-header">
            Your Chats &nbsp;
          </h1>
        </Row>
        <div className="chat-table">
          {userClubs.map((club) => (
            <div className="club-item" key={club.clubName}>
              <Button className="club-button" onClick={() => switchToChat(club.clubName)}>
                <Row>
                  <Col className="d-flex justify-content-center">
                    {club.clubName}
                  </Col>
                </Row>
              </Button>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  ));

  const showAllClubs = (() => (
    <Container>
      {clubsFail ? errorGetClubs() : showClubs()}
    </Container>
  ));

  const showChat = (() => (
    <Container>
      <Button onClick={switchToClubs}>Go back</Button>
      <Stack>
        {chatsFail && errorGetChats}
        <div className="chat-stack-scrollable">
          {currentChat.map((mess) => (
            <Row>
              <Col className="chat-item" key={mess.uniqueId}>
                {displayContent(mess.content) ? <img src={mess.content} className="rounded float-left" width="200px" alt="User Content" /> : <div /> }
                <div className="imessage">
                  <p className="from-them">{mess.message}</p>
                </div>
                <p>
                  {mess.fullName}
                  &nbsp;
                  :
                  &nbsp;
                  {getDate(mess.timeStamp)}
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
          <Form.Control id="content-text" type="message" placeholder="Send content link" onChange={parseContent} />
        </Form.Group>
        <Button variant="primary" onClick={submitMessage}> Send </Button>
      </Form>
    </Container>
  ));

  const showAChat = (() => (
    <Container>
      {chatsFail ? errorGetChats() : showChat()}
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
