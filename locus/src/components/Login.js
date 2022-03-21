import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';

const Login = function LoginComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const errorMsgEmptyFields = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please fill out all 6 fields below.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '120px' }}>
      <h1 className="text-center">Log-in</h1>
      {( usernameEmpty || passwordEmpty) && errorMsgEmptyFields()}
      <Card style={{
        width: '23rem',
        margin: 'auto',
        marginTop: '20px',
        borderRadius: '10px',
        backgroundColor: '#B5E48C',
        borderColor: '#B5E48C',
      }}
      >
        <Card.Body>
          {/* referenced https://react-bootstrap.github.io/forms/overview/ */}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control style={{ height: '25px' }} type="name" onChange={(e) => updateUsername(e)} />
              <Form.Label>Password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="name" onChange={(e) => updatePassword(e)} />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/loading" className="navbar-brand" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
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
          Log-in
        </Button>
      </Link>
    </div>
  );
};

export default Login;
