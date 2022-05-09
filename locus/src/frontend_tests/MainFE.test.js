/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter as Router } from 'react-router-dom';
import Main from '../components/Main';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

describe('initial displays', () => {
  test('Welcome text', () => {
    render(
      <Router>
        <Main />
      </Router>,
    );
    const textElement = screen.getAllByText(/Welcome/i);
    expect(textElement[0]).toBeInTheDocument();
  });
  test('login button', () => {
    render(
      <Router>
        <Main />
      </Router>,
    );
    const button = screen.getByRole('button', { name: 'Log-in' });
    expect(button).toBeInTheDocument();
  });
  test('register button', () => {
    render(
      <Router>
        <Main />
      </Router>,
    );
    const button = screen.getByRole('button', { name: 'Register' });
    expect(button).toBeInTheDocument();
  });
  test('button clicks', () => {
    render(
      <Router>
        <Main setJustRegistered={() => null} />
      </Router>,
    );
    const button = screen.getByRole('button', { name: 'Log-in' });
    const button2 = screen.getByRole('button', { name: 'Register' });
    userEvent.click(button);
    userEvent.click(button2);
  });
});
