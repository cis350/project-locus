/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { getUser } from '../modules/api';
import '../assets/Profile.css';

export default function Profile({ userEmail }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function initialize() {
      setUser(await getUser(userEmail));
    }
    initialize();
  }, []);

  if (!user) return <div>Loading...</div>;
  return (
    <div className="container">
      <h1 className="profile-text">Profile</h1>
      <div className="container profile-container">
        <div className="row justify-content-between">
          <div className="col-4 d-flex flex-column">
            <img className="profile-pic" src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="profile" />
          </div>
          <div className="col-7">
            <h3 className="profile-text">{`${user.firstName} ${user.lastName}`}</h3>
            <p className="profile-text">Year: {user.year}</p>
            <p className="profile-text">Major: {user.major}</p>
            <p className="profile-text">Email: {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
