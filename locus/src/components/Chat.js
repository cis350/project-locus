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
  const [userClubs, changeUserClubs] = useState([]);
  const [sendFail, changeSendFail] = useState(false);
  const [clubsFail, changeClubsFail] = useState(false);
  const [chatsFail, changeChatsFail] = useState(false);
  const currentClub = useRef('');
  const message = useRef('');
  const content = useRef('');
  // clubs user is in

  if (userClubs.length === 0) {
    getUserClubs(userEmail).then((res) => {
      if (res.status === 200) {
        changeClubsFail(false);
        changeUserClubs(res.jsonContent.clubsArray);
      } else {
        changeClubsFail(true);
      }
    });
  }

  const switchToChat = (clubName) => {
    currentClub.current = clubName;
    console.log(clubName);
    getClubChat(clubName).then((res) => {
      if (res.status === 200) {
        console.log(res);
        console.log(res.jsonContent);
        console.log('ppppppppppjjiubyhiubhbuibuibuibibibiib');
        changeChatsFail(false);
        changeChat(res.jsonContent);
      } else {
        console.log('here');
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
      console.log('balls in my face');
      sendMessage(currentClub.current, userEmail, message.current, content.current, new Date())
        .then((res) => {
          if (res.status === 200) {
            console.log('I like ass');
            changeSendFail(false);
            getClubChat(currentClub.current).then((resp) => {
              if (resp.status === 200) {
                changeChatsFail(false);
                message.current = '';
                content.current = '';
                document.getElementById('input-text').value = '';
                document.getElementById('content-text').value = '';
                changeChat(resp.jsonContent.clubObject.messages);
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
      async function fetchMessages() {
        // update with thens
        getClubChat(currentClub.current).then((resp) => {
          if (resp.status === 200) {
            changeChatsFail(false);
            changeChat(resp.jsonContent.clubObject.messages);
          } else {
            changeChatsFail(true);
          }
        });
      }
      const intervalId = setInterval(() => {
        if (currentClub.current !== '') {
          fetchMessages();
        }
      }, 5000);

      clearInterval(intervalId);
    },
    [currentChat],
  );

  const messageSender = (email) => {
    if (email === userEmail) {
      return 'from-me';
    }
    return 'from-them';
  };

  const imageSender = (email) => {
    if (email === userEmail) {
      return 'rounded float-right';
    }
    return 'rounded float-left';
  };

  const isValidUrl = (url) => {
    try {
      URL(url);
    } catch (e) {
      console.error(e);
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
              <Col className="chat-item" key={mess[4]}>
                <div className="imessage">
                  <p className={messageSender(mess[0])}>{mess[1]}</p>
                </div>
                {displayContent(mess[2]) ? <img src={mess[2]} className={imageSender(mess[0])} alt="User Content" /> : <div /> }
                <p>
                  {mess[0]}
                  :
                  {(new Date(mess[3])).toString()}
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
