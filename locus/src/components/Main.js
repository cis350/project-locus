import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';

const Main = function MainComponent({ justRegistered, setJustRegistered }) {
  const msgJustRegistered = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="success" style={{ width: '23rem', margin: 'auto', marginTop: '30px' }} className="text-center">
      Account created successfully!
    </Alert>
  ));

  const resetJustRegistered = () => {
    setJustRegistered(false);
  };

  return (
    <div className="container" style={{ position: 'relative', padding: '200px' }}>
      <h1 className="text-center">Welcome to Locus!</h1>
      {/* https://stackoverflow.com/questions/40701976/how-to-center-a-span-in-a-div */}
      <span style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Link to="/login" className="navbar-brand">
          <Button
            style={{
              backgroundColor: '#6A9B72',
              width: '120px',
              height: '50px',
              fontWeight: 'bold',
              fontSize: '25px',
              color: 'black',
              borderColor: '#6A9B72',
              marginRight: '25px',
            }}
            onClick={() => resetJustRegistered()}
          >
            Log-in
          </Button>
        </Link>
        <Link to="/register" className="navbar-brand">
          <Button
            style={{
              backgroundColor: '#6A9B72',
              width: '120px',
              height: '50px',
              fontWeight: 'bold',
              fontSize: '25px',
              color: 'black',
              borderColor: '#6A9B72',
            }}
            onClick={() => resetJustRegistered()}
          >
            Register
          </Button>
        </Link>
      </span>
      {justRegistered && msgJustRegistered()}
    </div>
  );
};

export default Main;
