/* eslint-disable import/no-unresolved */
const axios = require('axios');

const rootURL = 'localhost:3000';

async function login(email, password) {
  try {
    const response = await axios.get(`${rootURL}/login`, { email, password });
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

async function register(userEmail, userFirstName, userLastName, userPassword, userUniqueId) {
  try {
    const response = await axios.post(
      `${rootURL}/register`,
      {
        userEmail, userFirstName, userLastName, userPassword, userUniqueId,
      },
    );
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

async function home(id) {
  try {
    const response = await axios.post(`${rootURL}/${id}`, { id });
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

// clubs api

async function getUserClub(id) {
  try {
    const response = await axios.post(`${rootURL}/club/${id}`, { id });
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

async function createClub(id, clubName) {
  try {
    const response = await axios.post(`${rootURL}/createClub/${id}/${clubName}`, { id, clubName });
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

async function getClub(clubName) {
  try {
    const response = await axios.get(`${rootURL}/club/${clubName}`, { clubName });
    return response.data;
  } catch (err) {
    return { status: 500, error: 'Internal server error' };
  }
}

module.exports = {
  login, register, home, getUserClub, createClub, getClub,
};
