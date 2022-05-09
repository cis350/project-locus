/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import Club from '../components/Club';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const domain = 'http://localhost:3306';

// mock useNavigate: https://github.com/remix-run/react-router/issues/7811
const mockedNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

let mock;
beforeAll(() => {
  mock = new MockAdapter(axios);
});
afterEach(() => {
  mock.reset();
});

const dummyClub = { members: [], projects: [] };
test('club snapshot test', () => {
  const component = renderer.create(<Club club={dummyClub} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
