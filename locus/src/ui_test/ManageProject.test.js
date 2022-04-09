/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import ManageProject from '../components/ManageProject';

test('Manage Project Displays Members', () => {
  render(<ManageProject />);
  const textElement = screen.getByText(/Members/i);
  expect(textElement).toBeInTheDocument();
});

test('Manage Project Displays Attendance Button', () => {
  render(<ManageProject />);
  const buttonElement = screen.getByText(/Attendance/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Manage Project Displays Milestone Button', () => {
  render(<ManageProject />);
  const buttonElement = screen.getByText(/Manage Milestone/i);
  expect(buttonElement).toBeVisible();
});

test('Manage Project Displays Tasks Button', () => {
  render(<ManageProject />);
  const buttonElement = screen.getByText(/Tasks/i);
  expect(buttonElement).toBeVisible();
});

test('Manage Project Displays Analytics Button', () => {
  render(<ManageProject />);
  const buttonElement = screen.getByText(/View Analytics/i);
  expect(buttonElement).toBeVisible();
});

test('Manage Project Displays Add Member Button', () => {
  render(<ManageProject />);
  const buttonElement = screen.getByText(/Add Member/i);
  expect(buttonElement).toBeVisible();
});

test('Snapshot Test', () => {
  const component = renderer.create(<ManageProject logout={() => null} username="test player" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
