/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import ManageTasks from '../components/ManageTasks';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

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

test('manage tasks snapshot test', () => {
  const component = renderer.create(<ManageTasks />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
