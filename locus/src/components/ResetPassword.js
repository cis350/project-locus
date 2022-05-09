/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Button,
  Card, Form,
  Alert,
} from 'react-bootstrap';
import { getUserId, resetPassword } from '../modules/api';

const ResetPassword = function ResetPasswordComponent() {
  const [email, setEmail] = useState('');
  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [emailNotExist, setEmailNotExist] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordNotLong, setPasswordNotLong] = useState(false);
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false);
  const [passwordHasNoUpper, setPasswordHasNoUpper] = useState(false);
  const [passwordHasNoSpecialCharacter, setPasswordHasNoSpecialCharacter] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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

  const checkEmptyFields = () => {
    if (email === '' || password === '' || verifyPassword === '') {
      setFieldEmpty(true);
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(false);
      setServerError(false);
      setEmailNotExist(false);
      setIsInvalidEmail(false);
      setResetSuccess(false);
      return false;
    }
    setFieldEmpty(false);
    setPasswordNotLong(false);
    setPasswordsNoMatch(false);
    setPasswordHasNoUpper(false);
    setPasswordHasNoSpecialCharacter(false);
    setServerError(false);
    setEmailNotExist(false);
    setIsInvalidEmail(false);
    setResetSuccess(false);
    return true;
  };

  const checkValidPassword = () => {
    if (password !== verifyPassword) {
      setPasswordNotLong(false);
      setPasswordsNoMatch(true);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(false);
      setFieldEmpty(false);
      setServerError(false);
      setEmailNotExist(false);
      setIsInvalidEmail(false);
      setResetSuccess(false);
      return false;
    }
    if (password.length < 5) {
      setPasswordNotLong(true);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(false);
      setFieldEmpty(false);
      setServerError(false);
      setEmailNotExist(false);
      setIsInvalidEmail(false);
      setResetSuccess(false);
      return false;
    }
    if (!hasNoUpper(password)) {
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(true);
      setPasswordHasNoSpecialCharacter(false);
      setFieldEmpty(false);
      setServerError(false);
      setEmailNotExist(false);
      setIsInvalidEmail(false);
      setResetSuccess(false);
      return false;
    }
    if (!hasNoSpecialCharacter(password)) {
      setPasswordNotLong(false);
      setPasswordsNoMatch(false);
      setPasswordHasNoUpper(false);
      setPasswordHasNoSpecialCharacter(true);
      setFieldEmpty(false);
      setServerError(false);
      setEmailNotExist(false);
      setIsInvalidEmail(false);
      setResetSuccess(false);
      return false;
    }
    setPasswordNotLong(false);
    setPasswordsNoMatch(false);
    setPasswordHasNoUpper(false);
    setPasswordHasNoSpecialCharacter(false);
    setFieldEmpty(false);
    setServerError(false);
    setEmailNotExist(false);
    setIsInvalidEmail(false);
    setResetSuccess(false);
    return true;
  };

  const processUserInput = async () => {
    if (checkEmptyFields() && checkValidPassword()) {
      if (!validateEmail(email)) {
        setIsInvalidEmail(true);
        setPasswordNotLong(false);
        setPasswordsNoMatch(false);
        setPasswordHasNoUpper(false);
        setPasswordHasNoSpecialCharacter(false);
        setFieldEmpty(false);
        setServerError(false);
        setEmailNotExist(false);
        setResetSuccess(false);
      } else {
        getUserId(email).then((res) => {
          if (res.status === 200) {
            setIsInvalidEmail(false);
            setFieldEmpty(false);
            setServerError(false);
            setEmailNotExist(false);
            setPasswordNotLong(false);
            setPasswordsNoMatch(false);
            setPasswordHasNoUpper(false);
            setPasswordHasNoSpecialCharacter(false);
            resetPassword(email, password).then((res2) => {
              console.log(res2);
            });
            setResetSuccess(true);
          } else if (res.status === 404) {
            setIsInvalidEmail(false);
            setFieldEmpty(false);
            setServerError(false);
            setEmailNotExist(true);
            setPasswordNotLong(false);
            setPasswordsNoMatch(false);
            setPasswordHasNoUpper(false);
            setPasswordHasNoSpecialCharacter(false);
            setResetSuccess(false);
          } else if (res.status === 500) {
            setIsInvalidEmail(false);
            setFieldEmpty(false);
            setServerError(true);
            setEmailNotExist(false);
            setPasswordNotLong(false);
            setPasswordsNoMatch(false);
            setPasswordHasNoUpper(false);
            setPasswordHasNoSpecialCharacter(false);
            setResetSuccess(false);
          }
        });
      }
    }
  };

  const errorMsgEmptyEmail = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please enter your all 3 fields.
    </Alert>
  ));

  const errorMsgInvalidEmail = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Please enter a valid email address.
    </Alert>
  ));

  const errorMsgServerError = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Server error.
    </Alert>
  ));

  const errorMsgEmailNotExist = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Email does not exist.
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

  const resetSuccessMsg = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="success" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      Password was reset.
    </Alert>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '120px' }}>
      <h1 className="text-center">Reset Password</h1>
      {fieldEmpty && errorMsgEmptyEmail()}
      {serverError && errorMsgServerError()}
      {emailNotExist && errorMsgEmailNotExist()}
      {isInvalidEmail && errorMsgInvalidEmail()}
      {passwordNotLong && errorMsgPasswordTooShort()}
      {passwordsNoMatch && errorMsgPasswordsNotMatch()}
      {passwordHasNoUpper && errorMsgPasswordHasNoUpper()}
      {passwordHasNoSpecialCharacter && errorMsgPasswordHasNoSpecialCharacter()}
      {resetSuccess && resetSuccessMsg()}
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
              <Form.Label>New password</Form.Label>
              <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updatePassword(e)} />
              <Form.Label>Verify new password</Form.Label>
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
