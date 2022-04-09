/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Login from '../components/Login';

test('Displays Log-in text', () => {
  render(<Login setIsLoggedIn={() => null} setUserEmail={() => null} />);
  const textElement = screen.getByText(/Log-in/i);
  expect(textElement).toBeInTheDocument();
});

test('Displays Email', () => {
  render(<Login setIsLoggedIn={() => null} setUserEmail={() => null} />);
  const textElement = screen.getByText(/Email/i);
  expect(textElement).toBeInTheDocument();
});

test('Displays Password', () => {
  render(<Login setIsLoggedIn={() => null} setUserEmail={() => null} />);
  const textElement = screen.getByText(/Password/i);
  expect(textElement).toBeInTheDocument();
});

test('Displays Locus', () => {
  render(<Login setIsLoggedIn={() => null} setUserEmail={() => null} />);
  const textElement = screen.getByText(/Locus/i);
  expect(textElement).toBeInTheDocument();
});
