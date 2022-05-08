import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button, Container } from 'react-bootstrap';
import {
  getUserNotifications,
} from '../modules/api';
import '../assets/Navigation.css';

const Navigation = function NavigationComponent({ isLoggedIn, userId, userEmail }) {
  const [notifs, setNotifications] = useState([]);

  useEffect(() => {
    if (userEmail) {
      const intervalId = setInterval(() => {
        /// set up in api
        getUserNotifications(userEmail).then((resp) => {
          if (resp.status === 200) {
            setNotifications(resp.jsonContent);
          } else {
            setNotifications(notifs);
          }
        });
      }, 2000);
      return () => clearInterval(intervalId);
    }
    return null;
  }, [userEmail]);

  const noNotifications = (() => (
    <Link to={`/chats/${userId}`} className="navbar-brand">
      <Button className="navbar-button">
        Chats
      </Button>
    </Link>
  ));

  const notifications = (() => (
    <Link to={`/chats/${userId}`} className="navbar-brand">
      <Button className="navbar-button">
        Chats
      </Button>
      <Button className="navbar-button badge">
        {notifs.length}
      </Button>
    </Link>
  ));

  const mainForLoggedInUser = (() => (
    <div>
      <Link to={`/home/${userId}`} className="navbar-brand">
        <Button id="logoNav-button" className="navbar-button">
          Locus
        </Button>
      </Link>
      <Link to={`/home/${userId}`} className="navbar-brand">
        <Button className="navbar-button">
          Home
        </Button>
      </Link>
      {notifs.length > 0 ? notifications() : noNotifications()}
      <Link to={`/clubs/${userId}`} className="navbar-brand">
        <Button className="navbar-button">
          Club
        </Button>
      </Link>
      <Link to={`/projects/clubs/${userId}`} className="navbar-brand">
        <Button className="navbar-button">
          Projects
        </Button>
      </Link>
    </div>
  ));

  // link to log-in if the user is not logged in
  const mainForNonLoggedInUser = (() => (
    <div>
      <Link to="/" className="navbar-brand">
        <Button id="logoNav-button" className="navbar-button">
          Locus
        </Button>
      </Link>
    </div>
  ));

  return (
    // referenced https://react-bootstrap.github.io/components/navbar/
    <Navbar>
      <Container>
        {isLoggedIn ? mainForLoggedInUser() : mainForNonLoggedInUser()}
      </Container>
    </Navbar>
  );
};

export default Navigation;
