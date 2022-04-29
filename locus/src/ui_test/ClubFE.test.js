/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Clubs from '../components/Clubs';

const dummyClub = {
  members: ['Heng', 'Dustin', 'Soham', 'James', 'Jeffrey'],
  master: 'James',
  recent: ['Soham completed "Task 2" in project1, Milestone 2'],
  projects: {
    'project1': {
      lead: 'Dustin',
      progress: 0.75
    }
  },
};

test('Clubs display members', () => {
  render(<Clubs props={null} />);
  for (let i = 0; i < dummyClub.members.length; i += 1) {
    const member = screen.getByText(dummyClub.members[i]);
    expect(member).toBeInTheDocument();
  }
});

test('Clubs display recents', () => {
  render(<Clubs props={ null } />);
  for (let i = 0; i < dummyClub.recent.length; i += 1) {
    const event = screen.getByText(dummyClub.recent[i]);
    expect(event).toBeInTheDocument();
  }
});

test('Clubs display projects', () => {
  render(<Clubs props={null} />);
  for (let i = 0; i < dummyClub.projects.length; i += 1) {
    const projectname = screen.getByText(dummyClub.projects[i]);
    const lead = screen.getByText(dummyClub.projects[i].lead);
    expect(projectname).toBeInTheDocument();
    expect(lead).toBeInTheDocument();
  }
});
