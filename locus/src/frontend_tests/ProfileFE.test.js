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
  render(<Profile userEmail="test@gmail.com" />);
  const textElement = screen.getByText('Loading...');
  expect(textElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Profile />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
