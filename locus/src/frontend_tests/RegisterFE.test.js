/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Register from '../components/Register';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

describe('Initial displays', () => {
  test('Displays Register title', () => {
    render(<Register setJustRegistered={() => null} />);
    const textElement = screen.getAllByText(/Register/i);
    expect(textElement[0]).toBeInTheDocument();
  });

  test('Displays Register Button', () => {
    render(<Register setJustRegistered={() => null} />);
    const textElement = screen.getAllByText(/Register/i);
    expect(textElement[1]).toBeInTheDocument();
  });

  test('Displays Email', () => {
    render(<Register setJustRegistered={() => null} />);
    const textElement = screen.getByText(/Email/i);
    expect(textElement).toBeInTheDocument();
  });

  test('Displays Password', () => {
    render(<Register setJustRegistered={() => null} />);
    const textElement = screen.getByText('Password');
    expect(textElement).toBeInTheDocument();
  });

  test('Displays Verify Password', () => {
    render(<Register setJustRegistered={() => null} />);
    const textElement = screen.getByText(/Verify Password/i);
    expect(textElement).toBeInTheDocument();
  });
});

describe('Registration Alerts', () => {
  test('Empty fields alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const textElement = screen.getByText(/Please fill out all 5 fields below./i);
    expect(textElement).toBeInTheDocument();
  });
  test('verify password alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), 'abc');
    userEvent.type(screen.getByTestId('verpassword-input'), 'cba');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Please re-verify your password./i);
    expect(alertElement).toBeInTheDocument();
  });
  test('short password alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), 'abc');
    userEvent.type(screen.getByTestId('verpassword-input'), 'abc');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Password must be at least 5 characters./i);
    expect(alertElement).toBeInTheDocument();
  });
  test('uppercase password alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), 'abcde');
    userEvent.type(screen.getByTestId('verpassword-input'), 'abcde');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Password must have at least one upper case./i);
    expect(alertElement).toBeInTheDocument();
  });
  test('special character password alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), 'Abcde');
    userEvent.type(screen.getByTestId('verpassword-input'), 'Abcde');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Password must have at least one special character./i);
    expect(alertElement).toBeInTheDocument();
  });
  test('invalid email alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts');
    userEvent.type(screen.getByTestId('password-input'), 'Abcde!');
    userEvent.type(screen.getByTestId('verpassword-input'), 'Abcde!');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Invalid email./i);
    expect(alertElement).toBeInTheDocument();
  });
  test('invalid email 2 alert', () => {
    render(<Register setJustRegistered={() => null} />);
    userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
    userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
    userEvent.type(screen.getByTestId('email-input'), 'nuts@gmail.');
    userEvent.type(screen.getByTestId('password-input'), 'Abcde!');
    userEvent.type(screen.getByTestId('verpassword-input'), 'Abcde!');
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    const alertElement = screen.getByText(/Invalid email./i);
    expect(alertElement).toBeInTheDocument();
  });
  // test('email already exists alert', () => {
  //   render(<Register setJustRegistered={() => null} />);
  //   mock.onGet('http://localhost:3306/register').reply(400, { error: 'Email already exists' });
  //   userEvent.type(screen.getByTestId('firstname-input'), 'Jake');
  //   userEvent.type(screen.getByTestId('lastname-input'), 'Doh');
  //   userEvent.type(screen.getByTestId('email-input'), 'test@gmail.com');
  //   userEvent.type(screen.getByTestId('password-input'), 'Abcde!');
  //   userEvent.type(screen.getByTestId('verpassword-input'), 'Abcde!');
  //   userEvent.click(screen.getByRole('button', { name: /Register/i }));
  //   const alertElement = screen.getByText(/Email already exists./i);
  //   expect(alertElement).toBeInTheDocument();
  // });
});
