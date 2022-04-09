/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import Analytics from '../components/Analytics';

test('Analytics Displays Title', () => {
  render(<Analytics />);
  const textElement = screen.getByText(/Analytics/i);
  expect(textElement).toBeInTheDocument();
});

test('Analytics Displays Completed Milestones', () => {
  render(<Analytics />);
  const textElement = screen.getByText(/Completed Milestones/i);
  expect(textElement).toBeInTheDocument();
});

test('Analytics Displays Completed Tasks', () => {
  render(<Analytics />);
  const textElement = screen.getByText(/Completed Tasks/i);
  expect(textElement).toBeInTheDocument();
});

test('Analytics Displays Back Button', () => {
  render(<Analytics />);
  const buttonElement = screen.getByText(/Return/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Snapshot Test', () => {
  const component = renderer.create(<Analytics />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
