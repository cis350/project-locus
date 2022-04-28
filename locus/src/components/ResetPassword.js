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
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const processUserInput = async () => {
    if (email === '') {
      setEmailFieldEmpty(true);
      setServerError(false);
      setInvalidEmail(false);
      setEmailSuccess(false);
    } else {
      getUserId(email).then((res) => {
        if (res.status === 200) {
          setEmailFieldEmpty(false);
          setServerError(false);
          setInvalidEmail(false);
          setEmailSuccess(true);
        } else if (res.status === 404) {
          setEmailFieldEmpty(false);
          setServerError(false);
          setInvalidEmail(true);
          setEmailSuccess(false);
        } else if (res.status === 500) {
          setEmailFieldEmpty(false);
          setServerError(true);
          setInvalidEmail(false);
          setEmailSuccess(false);
        }
      });
    }
  };

  const errorMsgEmptyEmail = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please enter your email.
    </Alert>
  ));

  const errorMsgInvalidEmail = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Email does not exist.
    </Alert>
  ));

  const errorMsgServerError = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Server error.
    </Alert>
  ));

  const emailSuccessMsg = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="success" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Email has been sent with a link to reset password.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '120px' }}>
      <h1 className="text-center">Reset Password</h1>
      {emailFieldEmpty && errorMsgEmptyEmail()}
      {serverError && errorMsgServerError()}
      {invalidEmail && errorMsgInvalidEmail()}
      {emailSuccess && emailSuccessMsg()}
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
          onClick={() => processUserInput()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
