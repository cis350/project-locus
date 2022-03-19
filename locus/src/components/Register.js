import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form, Alert } from 'react-bootstrap';

const Register = function RegisterComponent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const [firstNameEmpty, setFirstNameEmpty] = useState(false);
  const [lastNameEmpty, setLastNameEmpty] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [usernameEmpty, setUserNameEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [verifyPasswordEmpty, setVerifyPasswordEmpty] = useState(false);

  const [usernameAlphanumeric, setUsernameAlphanumeric] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false); 
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
  const [passwordNotLong, setPasswordNotLong] = useState(false);

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateVerifyPassword = (e) => {
    setVerifyPassword(e.target.value);
  };

  const processUserInputs = () => {
    if (username === '') {
      setNoAlphanumeric(false);
      setNoNameEntered(true);
    } else if (!isAlphanumeric(username)) {
      setNoNameEntered(false);
      setNoAlphanumeric(true);
    } else {
      registerUser(username);
      onLogIn('/home');
    }
  };

  const errorMsgUserNameAlreadyExists = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Username already exists.
    </Alert>
  ));

  const errorMsgUsernameNotAlphanumeric = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Username must be alphanumeric.
    </Alert>
  ));

  const errorMsgPasswordsNotMatch = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please re-verify your password.
    </Alert>
  ));

  const errorMsgPasswordTooShort = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Password must be at least 5 characters.
    </Alert>
  ));

  const errorMsgEmailAlreadyExists = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Email already exists.
    </Alert>
  ));

  const errorMsgEmptyFields = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please fill out all 6 fields below.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '10px' }}>
      <h1 className="text-center">Register</h1>
      {(firstNameEmpty
        || lastNameEmpty
        || emailEmpty
        || usernameEmpty
        || passwordEmpty
        || verifyPasswordEmpty) && errorMsgEmptyFields()}
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
              <Form.Label>First name</Form.Label>
              <Form.Control style={{ height: '25px' }} type="name" onChange={(e) => updateFirstName(e)} />
              <Form.Label>Last name</Form.Label>
              <Form.Control style={{ height: '25px' }} type="name" onChange={(e) => updateLastName(e)} />
              <Form.Label>Email</Form.Label>
              <Form.Control style={{ height: '25px' }} type="email" onChange={(e) => updateEmail(e)} />
              <Form.Label>Username</Form.Label>
              <Form.Control style={{ height: '25px' }} type="username" onChange={(e) => updateUsername(e)} />
              <Form.Label>Password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updatePassword(e)} />
              <Form.Label>Verify password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updateVerifyPassword(e)} />
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
          Register
        </Button>
      </Link>
    </div>
  );
};

export default Register;
