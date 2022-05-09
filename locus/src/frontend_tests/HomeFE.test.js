/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import Home from '../components/Home';

const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

test('member profile test', () => {
  render(<Home userEmail="test@gmail.com" />);
  const textElement = screen.getByText('Loading...');
  expect(textElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Home />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
