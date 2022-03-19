import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Main = function MainComponent() {
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
          >
            Register
          </Button>
        </Link>
      </span>
    </div>
  );
};

export default Main;
