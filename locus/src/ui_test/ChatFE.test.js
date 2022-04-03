/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Chat from '../components/Chat';

const dummyEmail = '16fangd@gmail.com';

const dummyChatClubsNames = ['PVG', 'PennLabs', 'WUFC', 'WITG'];

test('Displays chat text', () => {
  render(<Chat props={ dummyEmail } />);
  const textElement = screen.getByText(/Your Chats/i);
  expect(textElement).toBeInTheDocument();
});

test('Displays club chat groups', () => {
  render(<Chat props={ dummyEmail } />);
  dummyChatClubsNames.forEach(
    (element) => expect(screen.getByText(element)).toBeInTheDocument(),
  );
});
