import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';
import { register } from '../modules/fetchRequests';

const Register = function RegisterComponent({ setJustRegistered }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false);
  const [passwordNotAlphanumeric, setPasswordNotAlphanumeric] = useState(false);
  const [passwordNotLong, setPasswordNotLong] = useState(false);

  const navigate = useNavigate();

  // handles redirecting to "/home"
  function onRegister(path) {
    // referenced https://www.npmjs.com/package/uuid
    setJustRegistered(true);
    navigate(path);
  }

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateVerifyPassword = (e) => {
    setVerifyPassword(e.target.value);
  };

  // referenced https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = (inputEmail) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(inputEmail);
  };

  const validatePassWord = (inputPassword) => {
    for (let i = 0; i < inputPassword.length; i += 1) {
      const currChar = inputPassword.charCodeAt(i);
      if ((currChar < 48 || currChar > 57) && (currChar < 65 || currChar > 90)
        && (currChar < 97 || currChar > 122)) {
        return false;
      }
    }
    return true;
  };

  // make it better
  const checkEmptyFields = () => {
    if (firstName === '' || lastName === '' || email === '' || password === '' || verifyPassword === '') {
      setFieldEmpty(true);
      return false;
    }
    setFieldEmpty(false);
    return true;
  };

  const checkValidPassword = () => {
    if (password !== verifyPassword) {
      setPasswordNotAlphanumeric(false);
      setPasswordNotLong(false);
      setPasswordsNoMatch(true);
      return false;
    }
    if (!validatePassWord(password)) {
      setPasswordNotAlphanumeric(true);
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      return false;
    }
    if (password.length < 5) {
      setPasswordNotAlphanumeric(false);
      setPasswordNotLong(true);
      setPasswordsNoMatch(false);
      return false;
    }
    setPasswordNotAlphanumeric(false);
    setPasswordNotLong(false);
    setPasswordsNoMatch(false);
    return true;
  };

  const processUserInputs = () => {
    if (checkEmptyFields() && checkValidPassword()) {
      if (!validateEmail(email)) {
        setEmailAlreadyExists(false);
        setIsInvalidEmail(true);
      } else {
        register(firstName, lastName, email, password)
          .then((res) => {
            console.log(res.jsonContent);
            console.log(res.status);
            if (res.status === 201) {
              setIsInvalidEmail(false);
              setEmailAlreadyExists(false);
              onRegister('/');
            }
            if (res.status === 400) {
              setIsInvalidEmail(false);
              setEmailAlreadyExists(true);
            }
          });
      }
    }
  };

  const errorMsgInvalidEmail = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Invalid email.
    </Alert>
  ));

  const errorMsgPasswordNotAlphanumeric = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Password must be alphanumeric.
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
      Please fill out all 5 fields below.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <h1 className="text-center">Register</h1>
      {fieldEmpty && errorMsgEmptyFields()}
      {emailAlreadyExists && errorMsgEmailAlreadyExists()}
      {passwordNotLong && errorMsgPasswordTooShort()}
      {passwordsNoMatch && errorMsgPasswordsNotMatch()}
      {passwordNotAlphanumeric && errorMsgPasswordNotAlphanumeric()}
      {isInvalidEmail && errorMsgInvalidEmail()}
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
              <Form.Label>Password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updatePassword(e)} />
              <Form.Label>Verify password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updateVerifyPassword(e)} />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <div className="navbar-brand" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
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
          onClick={() => processUserInputs()}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Register;
