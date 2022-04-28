/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import Tasks from '../components/Tasks';

test('Tasks Displays Title', () => {
  render(<Tasks />);
  const textElement = screen.getByText(/Active Tasks/i);
  expect(textElement).toBeInTheDocument();
});

test('Milestones Displays Create Button', () => {
  render(<Tasks />);
  const buttonElement = screen.getByText(/Create Task/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Tasks />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
