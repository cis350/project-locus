import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';
import { login, getLockout, updateLockout } from '../modules/fetchRequests';
// import { verifyLogInInfo, getUserUniqueId } from '../modules/storage';

const Login = function LoginComponent({ setIsLoggedIn, setUserEmail, setUniqueId }) {
  const [logInEmail, setLogInEmail] = useState('');
  const [logInPassword, setLogInPassword] = useState('');

  const [logInFieldEmpty, setLogInFieldEmpty] = useState(false);
  const [logInInfoInvalid, setLogInInfoInvalid] = useState(false);
  const [lockout, setLockout] = useState(false);
  const loginAttempts = useRef(0);

  getLockout(logInEmail).then((res) => {
    if (res.status === 200) {
      const date = Date.now();
      if (res.jsonContent.userLockout > date) {
        setLockout(true);
      }
    }
  });

  const navigate = useNavigate();

  // handles redirecting to "/home"
  function onLogIn(path) {
    setIsLoggedIn(true);
    setUserEmail(logInEmail);
    navigate(path);
  }

  const updateEmail = (e) => {
    setLogInEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setLogInPassword(e.target.value);
  };

  const processUserInputs = async () => {
    if (logInEmail === '' || logInPassword === '') {
      setLogInFieldEmpty(true);
      setLogInInfoInvalid(false);
    } else {
      getLockout(logInEmail).then((resp) => {
        if (resp.status === 200) {
          const date = Date.now();
          // need to fix this if statement
          // mongo does something weird with dates
          if (resp.jsonContent.userLockout > date) {
            setLockout(true);
          } else {
            login(logInEmail, logInPassword)
              .then((res) => {
                // TODO: Remove after debugging
                console.log(res.jsonContent);
                console.log(res.status);
                if (res.status === 200) {
                  setLogInFieldEmpty(false);
                  setLogInInfoInvalid(false);
                  setUniqueId(res.jsonContent.userId);
                  onLogIn(`/home/${res.jsonContent.userId}`);
                } else {
                  setLogInFieldEmpty(false);
                  setLogInInfoInvalid(true);
                  loginAttempts.current += 1;
                  if (loginAttempts.current >= 5) {
                    if (loginAttempts.current === 5) {
                      updateLockout(logInEmail, date).then((response) => {
                        if (response.status === 200) {
                          setLockout(true);
                        }
                      });
                    }
                  }
                }
              });
          }
        }
      });
    }

    // else if (!verifyLogInInfo(logInEmail, logInPassword)) {
    //   setLogInFieldEmpty(false);
    //   setLogInInfoInvalid(true);
    // } else {
    //   const uniqueId = getUserUniqueId(logInEmail);
    //   setLogInFieldEmpty(false);
    //   setLogInInfoInvalid(false);
    //   onLogIn(`/home/${uniqueId}`);
    // }
  };

  const errorMsgEmptyFields = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please enter both your email and password.
    </Alert>
  ));

  const errorMsgLogInInfoInvalid = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Email or/and password invalid.
    </Alert>
  ));

  const errorMsgUserLockout = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Too many failed attempts. Please try again later.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '120px' }}>
      <h1 className="text-center">Log-in</h1>
      {logInFieldEmpty && errorMsgEmptyFields()}
      {logInInfoInvalid && errorMsgLogInInfoInvalid()}
      {lockout && errorMsgUserLockout()}
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
              <Form.Label>Email</Form.Label>
              <Form.Control style={{ height: '25px' }} type="email" onChange={(e) => updateEmail(e)} />
              <Form.Label>Password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updatePassword(e)} />
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
          Log-in
        </Button>
      </div>
    </div>
  );
};

export default Login;
