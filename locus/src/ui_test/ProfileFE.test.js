/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Profile from '../components/Profile';

const user = {
  id: 1, name: 'Dustin Fang', year: 2024, major: 'Computer Science', email: 'fdustin@seas.upenn.edu',
};

test('member profile test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Member Profile');
  expect(linkElement).toBeInTheDocument();
});

test('name test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Dustin Fang');
  expect(linkElement).toBeInTheDocument();
});

test('year test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Year: 2024');
  expect(linkElement).toBeInTheDocument();
});

test('major test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Major: Computer Science');
  expect(linkElement).toBeInTheDocument();
});

test('email test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Email: fdustin@seas.upenn.edu');
  expect(linkElement).toBeInTheDocument();
});

test('message test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Message');
  expect(linkElement).toBeInTheDocument();
});

test('image test', () => {
  render(<Profile id={user.id} />);
  const linkElement = screen.getByText('Message');
  expect(linkElement).toBeInTheDocument();
});
