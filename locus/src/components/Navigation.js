import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button, Container } from 'react-bootstrap';

const Navigation = function NavigationComponent(props) {
  const { username, isLoggedIn } = props;

  // link to home if the user is logged in
  const mainForLoggedInUser = (() => (
    <Link to="/home" className="navbar-brand">Guess The Celebrity</Link>
  ));

  // link to log-in if the user is not logged in
  const mainForNonLoggedInUser = (() => (
    <Link to="/" className="navbar-brand">
      <Button
        style={{
          backgroundColor: '#B1DFAD',
          width: '120px',
          height: '50px',
          fontWeight: 'bold',
          fontSize: '25px',
          color: 'black',
          borderColor: '#B1DFAD',
          marginTop: '10px',
        }}
      >
        Locus
      </Button>
    </Link>
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
