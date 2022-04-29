import React from 'react';
import Profile from './Profile';

const Home = function HomeComponent({ userEmail }) {
  return (
    <div>
      <Profile userEmail={userEmail} />
    </div>
  );
};

export default Home;
