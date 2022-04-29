/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import Register from '../components/Register';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => mockedNavigator,
}));

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

test('Snapshot Test', () => {
  const component = renderer.create(<Register />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});