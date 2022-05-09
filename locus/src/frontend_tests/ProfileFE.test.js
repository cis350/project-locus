/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../components/Profile';
import renderer from 'react-test-renderer';

jest.mock('../modules/storage', () => {
  const originalModule = jest.requireActual('../modules/storage');
  //Mock the default getUserFullName and getUserUniqueId in modules/storage
  return {
    __esModule: true,
    ...originalModule,
    getUserFullName: jest.fn(() => 'Dustin Fang'),
    getUserUniqueId: jest.fn(() => '1'),
  };
});

const user = {
  id: 1, name: 'Dustin Fang', year: 2024, major: 'Computer Science', email: 'fdustin@seas.upenn.edu',
};

test('member profile test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Profile');
  expect(textElement).toBeInTheDocument();
});

test('name test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Dustin Fang');
  expect(textElement).toBeInTheDocument();
});

test('year test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Year: 2024');
  expect(textElement).toBeInTheDocument();
});

test('major test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Major: Computer Science');
  expect(textElement).toBeInTheDocument();
});

test('email test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Email: fdustin@seas.upenn.edu');
  expect(textElement).toBeInTheDocument();
});

test('message test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Message');
  expect(textElement).toBeInTheDocument();
});

test('image test', () => {
  render(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const textElement = screen.getByText('Message');
  expect(textElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Profile userEmail={'fdustin@seas.upenn.edu'} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});