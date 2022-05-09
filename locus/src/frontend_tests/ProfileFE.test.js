/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import Profile from '../components/Profile';

jest.mock('../modules/storage', () => {
  const originalModule = jest.requireActual('../modules/storage');
  // Mock the default getUserFullName and getUserUniqueId in modules/storage
  return {
    __esModule: true,
    ...originalModule,
    getUserFullName: jest.fn(() => 'Dustin Fang'),
    getUserUniqueId: jest.fn(() => '1'),
  };
});

test('member profile test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Profile');
  expect(textElement).toBeInTheDocument();
});

test('name test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Dustin Fang');
  expect(textElement).toBeInTheDocument();
});

test('year test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Year: 2024');
  expect(textElement).toBeInTheDocument();
});

test('major test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Major: Computer Science');
  expect(textElement).toBeInTheDocument();
});

test('email test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Email: fdustin@seas.upenn.edu');
  expect(textElement).toBeInTheDocument();
});

test('message test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Message');
  expect(textElement).toBeInTheDocument();
});

test('image test', () => {
  render(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const textElement = screen.getByText('Message');
  expect(textElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Profile userEmail="fdustin@seas.upenn.edu" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
