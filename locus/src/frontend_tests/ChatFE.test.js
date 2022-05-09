/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Chat from '../components/Chat';

test('analytics snapshot test', () => {
  const component = renderer.create(<Chat />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
