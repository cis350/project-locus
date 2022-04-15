/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import Milestones from '../components/Milestones';

test('Milestones Displays Title', () => {
  render(<Milestones />);
  const textElement = screen.getByText(/Active Milestones/i);
  expect(textElement).toBeInTheDocument();
});

test('Milestones Displays Create Button', () => {
  render(<Milestones />);
  const buttonElement = screen.getByText(/Create Milestone/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Milestones />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
