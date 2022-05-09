/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Chat from '../components/Chat';

const dummyEmail = '16fangd@gmail.com';
const dummyChatClubsNames = ['PVG', 'PennLabs', 'WUFC', 'WITG'];

test('analytics snapshot test', () => {
  const component = renderer.create(<Chat />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
