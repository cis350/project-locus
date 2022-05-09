/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter as Router } from 'react-router-dom';
import Navigation from '../components/Navigation';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

describe('initial displays', () => {
  test('Not logged users', () => {
    render(
      <Router>
        <Navigation isLoggedIn={() => false} />
      </Router>,
    );
    const button = screen.getByRole('button', { name: 'Locus' });
    expect(button).toBeInTheDocument();
  });
  test('Logged users', () => {
    render(
      <Router>
        <Navigation isLoggedIn={() => true} />
      </Router>,
    );
    const button = screen.getByRole('button', { name: 'Locus' });
    const button2 = screen.getByRole('button', { name: 'Home' });
    const button3 = screen.getByRole('button', { name: 'Chats' });
    const button4 = screen.getByRole('button', { name: 'Club' });
    const button5 = screen.getByRole('button', { name: 'Projects' });
    expect(button).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
    expect(button3).toBeInTheDocument();
    expect(button4).toBeInTheDocument();
    expect(button5).toBeInTheDocument();
  });
});
