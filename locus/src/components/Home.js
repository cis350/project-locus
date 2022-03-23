import React from 'react';
import { getUserFullName } from '../modules/storage';

const Home = function HomeComponent({ userEmail }) {
  return (
    <div>
      Hello,
      {getUserFullName(userEmail)}
    </div>
  );
};

export default Home;
