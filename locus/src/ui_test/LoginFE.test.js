/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import renderer from 'react-test-renderer';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => mockedNavigator,
}));

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
  const textElement = screen.getByText(/Password/i);
  expect(textElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Login />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});