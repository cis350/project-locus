import React from 'react';
import { getUserFullName } from '../modules/storage';
import Profile from './Profile';

const Home = function HomeComponent({ userEmail }) {
  return (
    <div>
      <Profile userEmail={userEmail} />
    </div>
  );
};

export default Home;
