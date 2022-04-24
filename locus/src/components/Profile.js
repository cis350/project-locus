/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import '../assets/Profile.css';

export default function Profile({ userEmail, userId }) {
  // fetch user with the given id and display user with following info
  const user = {
    id: userId,
    name: 'To be added', // Backend call here
    year: 2024,
    major: 'Computer Science',
    email: userEmail,
  };

  // determine what the user can do on this profile
  let option = 'Message';
  const currUserId = 2;
  if (user.id === currUserId) {
    option = 'Log-out';
  }

  // log what the button does after the user clicks on it
  function handleOption() {
    if (option === 'Message') console.log(`Message ${user.name}`);
    else console.log('Logged out');
  }
  return (
    <div className="container">
      <h1 className="profile-text">Profile</h1>
      <div className="container profile-container">
        <div className="row justify-content-between">
          <div className="col-4 d-flex flex-column">
            <img className="profile-pic" src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="profile" />
            <button type="button" className="btn profile-button" onClick={handleOption}><strong>{option}</strong></button>
          </div>
          <div className="col-7">
            <h3 className="profile-text">{user.name}</h3>
            <p className="profile-text">Year: {user.year}</p>
            <p className="profile-text">Major: {user.major}</p>
            <p className="profile-text">Email: {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
