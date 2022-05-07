/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../components/Profile';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

test('member profile test', () => {
  render(<Profile />);
  // const textElement = screen.getByText('Profile');
  // expect(textElement).toBeInTheDocument();
});

// test('name test', () => {
//   render(<Profile userEmail="fdustin@seas.upenn.edu" />);
//   const textElement = screen.getByText('Dustin Fang');
//   expect(textElement).toBeInTheDocument();
// });

// test('year test', () => {
//   render(<Profile userEmail="fdustin@seas.upenn.edu" />);
//   const textElement = screen.getByText('Year: 2024');
//   expect(textElement).toBeInTheDocument();
// });

// test('major test', () => {
//   render(<Profile userEmail="fdustin@seas.upenn.edu" />);
//   const textElement = screen.getByText('Major: Computer Science');
//   expect(textElement).toBeInTheDocument();
// });

// test('email test', () => {
//   render(<Profile userEmail="fdustin@seas.upenn.edu" />);
//   const textElement = screen.getByText('Email: fdustin@seas.upenn.edu');
//   expect(textElement).toBeInTheDocument();
// });
