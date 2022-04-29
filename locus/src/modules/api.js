const axios = require('axios');

const domain = 'http://localhost:3306';

/*
 * Login and Registraition fetches
 */
async function register(firstName, lastName, email, password, year, major) {
  try {
    const result = await axios.post(`${domain}/register`, {
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      userPassword: password,
      userYear: year,
      userMajor: major,
    });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function login(userEmail, userPassword) {
  try {
    const result = await axios.post(`${domain}/login`, { email: userEmail, password: userPassword });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getUserId(userEmail) {
  try {
    const result = await axios.get(`${domain}/id/${userEmail}`);
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

/*
 * Club fetches
 */
// create club with given name and master
async function createClub(clubName, masterId) {
  try {
    const result = await axios.post(`${domain}/club`, { clubName, id: masterId });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get all the clubs by userEmail and returns an array of [clubname, role]
async function getUserClubs(userEmail) {
  try {
    const result = await axios.get(`${domain}/club/${userEmail}`);
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get specific club given the name of the club
async function getSpecificClub(clubName) {
  try {
    const result = await axios.get(`/club/${clubName}`);
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getClubChat(clubName) {
  try {
    const result = await axios.get(`/chats/${clubName}`);
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function sendMessage(clubName, userEmail, msg, date) {
  try {
    const result = await axios.post(`/chats/${clubName}`, { email: userEmail, message: msg, time: date });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

module.exports = {
  register, login, getUserId, createClub, getSpecificClub, getUserClubs, getClubChat, sendMessage,
};
