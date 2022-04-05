/**
* @jest-environment jsdom
*/

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

import Register from '../components/Register';

test('Displays Locus', () => {
  render(<Register setJustRegistered={() => null} />);
  const textElement = screen.getByText(/Locus/i);
  expect(textElement).toBeInTheDocument(); 
});

test('Displays Register title', () => {
  render(<Register setJustRegistered={() => null} />);
  const textElement = screen.getByText(/Register/i);
  expect(textElement).toBeInTheDocument(); 
});

test('Displays Email', () => {
  render(<Register setJustRegistered={() => null} />);
  const textElement = screen.getByText(/Email/i);
  expect(textElement).toBeInTheDocument(); 
});

test('Displays Password', () => {
  render(<Register setJustRegistered={() => null} />);
  const textElement = screen.getByText(/Password/i);
  expect(textElement).toBeInTheDocument(); 
});

