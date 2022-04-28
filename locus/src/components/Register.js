import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';
import { register } from '../modules/fetchRequests';
import majors from '../assets/Majors.json';

const Register = function RegisterComponent({ setJustRegistered }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('2022');
  const [major, setMajor] = useState('Accounting');
  const [verifyPassword, setVerifyPassword] = useState('');

  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false);
  const [passwordNotLong, setPasswordNotLong] = useState(false);
  const [passwordHasNoUpper, setPasswordHasNoUpper] = useState(false);
  const [passwordHasNoSpecialCharacter, setPasswordHasNoSpecialCharacter] = useState(false);

  const navigate = useNavigate();

  // setup major selection form
  const displayMajorSelections = [];
  for (let i = 0; i < majors.length; i += 1) {
    displayMajorSelections.push(
      <option value={majors[i]} key={`major${i}`}>{majors[i]}</option>,
    );
  }

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

  // referenced https://stackoverflow.com/questions/35674161/regex-to-check-if-password-contains-at-least-one-capital-letter
  const hasNoUpper = (inputPassword) => {
    const re = /^(.*[A-Z].*)$/;
    return re.test(inputPassword);
  };

  // referenced https://stackoverflow.com/questions/18812317/javascript-regex-for-special-characters
  const hasNoSpecialCharacter = (inputPassword) => {
    const re = /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
    return re.test(inputPassword);
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
      setPasswordNotLong(false);
      setPasswordsNoMatch(true);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(false);
      return false;
    }
    if (password.length < 5) {
      setPasswordNotLong(true);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(false);
      return false;
    }
    if (!hasNoUpper(password)) {
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(true);
      setPasswordHasNoSpecialCharacter(false);
      return false;
    }
    if (!hasNoSpecialCharacter(password)) {
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(true);
      return false;
    }
    setPasswordNotLong(false);
    setPasswordsNoMatch(false);
    setPasswordHasNoUpper(false);
    setPasswordHasNoSpecialCharacter(false);
    return true;
  };

  const processUserInputs = async () => {
    if (checkEmptyFields() && checkValidPassword()) {
      if (!validateEmail(email)) {
        setEmailAlreadyExists(false);
        setIsInvalidEmail(true);
      } else {
        register(firstName, lastName, email, password, year, major)
          .then((res) => {
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

  const errorMsgPasswordHasNoUpper = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Password must have at least one upper case.
    </Alert>
  ));

  const errorMsgPasswordHasNoSpecialCharacter = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Password must have at least one special character.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <h1 className="text-center">Register</h1>
      {fieldEmpty && errorMsgEmptyFields()}
      {emailAlreadyExists && errorMsgEmailAlreadyExists()}
      {passwordNotLong && errorMsgPasswordTooShort()}
      {passwordsNoMatch && errorMsgPasswordsNotMatch()}
      {isInvalidEmail && errorMsgInvalidEmail()}
      {passwordHasNoUpper && errorMsgPasswordHasNoUpper()}
      {passwordHasNoSpecialCharacter && errorMsgPasswordHasNoSpecialCharacter()}
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
              <Form.Control style={{ height: '35px' }} type="name" onChange={(e) => updateFirstName(e)} />
              <Form.Label>Last name</Form.Label>
              <Form.Control style={{ height: '35px' }} type="name" onChange={(e) => updateLastName(e)} />
              <Form.Label>Email</Form.Label>
              <Form.Control style={{ height: '35px' }} type="email" onChange={(e) => updateEmail(e)} />
              <Form.Label>Year</Form.Label>
              <Form.Select onChange={(e) => setYear(e.target.value)}>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Form.Select>
              <Form.Label>Major</Form.Label>
              <Form.Select onChange={(e) => setMajor(e.target.value)}>
                {displayMajorSelections}
              </Form.Select>
              <Form.Label>Password</Form.Label>
              <Form.Control
                style={{ height: '35px' }}
                type="password"
                maxlength="20"
                onChange={(e) => updatePassword(e)}
              />
              <Form.Label>Verify password</Form.Label>
              <Form.Control style={{ height: '35px' }} type="password" maxlength="20" onChange={(e) => updateVerifyPassword(e)} />
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
