/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const domain = 'http://localhost:3306';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

let mock;
beforeAll(() => {
  mock = new MockAdapter(axios);
});
afterEach(() => {
  mock.reset();
});

describe('Initial Login page displays', () => {
  test('Displays Log-in text', () => {
    render(<Login />);
    const textElement = screen.getAllByText(/Log-in/i);
    expect(textElement[0]).toBeInTheDocument();
  });
  test('Displays Email', () => {
    render(<Login />);
    const textElement = screen.getByText(/Email/i);
    expect(textElement).toBeInTheDocument();
  });
  test('Displays Password', () => {
    render(<Login />);
    const textElement = screen.getByLabelText(/Password/i);
    expect(textElement).toBeInTheDocument();
  });
  test('Displays log-in button', () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /Log-in/i });
    expect(button).toBeInTheDocument();
  });
  test('Displays reset password button', () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /reset/i });
    expect(button).toBeInTheDocument();
  });
});

describe('Alert message tests', () => {
  test('empty fields', () => {
    render(<Login />);
    userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
    const alertElement = screen.getByText('Please enter both your email and password.');
    expect(alertElement).toBeInTheDocument();
  });
  test('password field empty', () => {
    render(<Login />);
    userEvent.type(screen.getByTestId('email-input'), 'test@gmail.com');
    userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
    const alertElement = screen.getByText('Please enter both your email and password.');
    expect(alertElement).toBeInTheDocument();
  });
  test('email field empty', () => {
    render(<Login />);
    userEvent.type(screen.getByTestId('password-input'), 'pass');
    userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
    const alertElement = screen.getByText('Please enter both your email and password.');
    expect(alertElement).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /reset/i }));
  });
  // test('invalid login', () => {
  //   render(<Login />);
  //   userEvent.type(screen.getByTestId('email-input'), 'test@gmail.com');
  //   userEvent.type(screen.getByTestId('password-input'), 'pass');
  //   userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
  //   const alertElement = screen.getByText('Email or/and password invalid.');
  //   expect(alertElement).toBeInTheDocument();
  // });
});

describe('Login Button Tests', () => {
  test('Click Login with 200', () => {
    render(<Login />);
    userEvent.type(screen.getByTestId('email-input'), 'email');
    userEvent.type(screen.getByTestId('password-input'), 'pass');
    // mock.onPost(`${domain}/login`).reply(200);
    userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
  });
  // test('Click Login with 400', () => {
  //   render(<Login />);
  //   userEvent.type(screen.getByTestId('email-input'), 'email');
  //   userEvent.type(screen.getByTestId('password-input'), 'pass');
  //   mock.onPost(`${domain}/login`).reply(400);
  //   userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
  // });
  // test('Click Login with 403', () => {
  //   render(<Login />);
  //   userEvent.type(screen.getByTestId('email-input'), 'email');
  //   userEvent.type(screen.getByTestId('password-input'), 'pass');
  //   mock.onPost(`${domain}/login`).reply(403);
  //   userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
  // });
  // test('Click Login with 404', () => {
  //   render(<Login />);
  //   userEvent.type(screen.getByTestId('email-input'), 'email');
  //   userEvent.type(screen.getByTestId('password-input'), 'pass');
  //   mock.onPost(`${domain}/login`).reply(404);
  //   userEvent.click(screen.getByRole('button', { name: /Log-in/i }));
  // });
});
