/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import Milestones from '../components/Milestones';

test('Attendance Displays Title', () => {
  render(<Attendance />);
  const textElement = screen.getByText(/Meeting Attendance/i);
  expect(textElement).toBeInTheDocument();
});

test('Attendance Displays Back Button', () => {
  render(<Attendance />);
  const buttonElement = screen.getByText(/Return/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Attendance Displays Submit Button', () => {
  render(<Attendance />);
  const buttonElement = screen.getByText(/Submit Attendance/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Attendance />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
