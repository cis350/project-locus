import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';
import { getUserId } from '../modules/fetchRequests';
// import { verifyLogInInfo, getUserUniqueId } from '../modules/storage';

const ResetPassword = function ResetPasswordComponent() {
  const [email, setEmail] = useState('');
  const [emailFieldEmpty, setEmailFieldEmpty] = useState(false);
  const [serverError, setServerError] = useState(false);

  const navigate = useNavigate();

  // handles redirecting to "/home"
  function onLogIn(path) {
    navigate(path);
  }

  const updateEmail = (e) => {
    setEmailFieldEmpty(e.target.value);
  };

  const processUserInput = async () => {
    if (email === '') {
      setEmailFieldEmpty(true);
    } else {
      getUserId(email).then((res) => {
        if (res.status === 200) {
          setEmailFieldEmpty(false);

        } else if (res.status === 404) {
          setLogInFieldEmpty(false);
          setLogInInfoInvalid(true);
          setLockout(false);
        } else if (res.status === 500) {
          setLogInFieldEmpty(false);
          setLogInInfoInvalid(false);
          setLockout(true);
        }
      });
    }
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
      <h1 className="text-center">Reset Password</h1>
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
            fontSize: '20px',
            color: 'black',
            borderColor: '#6A9B72',
          }}
          onClick={() => processUserInputs()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
