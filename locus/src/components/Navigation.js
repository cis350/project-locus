import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button, Container } from 'react-bootstrap';
//  import { getUserUniqueId } from '../modules/storage';
import '../assets/Navigation.css';

const Navigation = function NavigationComponent({ isLoggedIn, userId }) {
  // link to home if the user is logged in
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
      <Link to={`/chats/${userId}`} className="navbar-brand">
        <Button className="navbar-button">
          Chats
        </Button>
      </Link>
      <Link to={`/clubs/${userId}`} className="navbar-brand">
        <Button className="navbar-button">
          Club
        </Button>
      </Link>
      <Link to={`/projects/manage-projects/${userId}`} className="navbar-brand">
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
