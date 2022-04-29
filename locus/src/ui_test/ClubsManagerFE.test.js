/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Clubs from '../components/Clubs';

const dummyClubs = {
  'club1': {
    master: 'James'
  },
  'club2': {
    master: 'Dustin'
  }
};

test('Clubs Displays Which Club Needs Work?', () => {
  render(<Clubs props={null} />);
  const textElement = screen.getByText(/Which Club Needs Work?/i);
  expect(textElement).toBeInTheDocument();
});

test('Clubs button using Master', () => {
  render(<Clubs props={null} />);
  const buttonElements = screen.getByText(/Master: /i);
  expect(buttonElements).toBeInTheDocument();
});

test('Clubs names showing', () => {
  render(<Clubs props={null} />);
  for (let i = 0; i < dummyClubs.length; i += 1) {
    const clubName = dummyClubs[i];
    const textElement = screen.getByText(clubName);
    expect(textElement).toBeInTheDocument();
  }
});
