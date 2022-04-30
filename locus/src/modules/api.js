const axios = require('axios');

const domain = 'http://localhost:3306';

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
    return { status: result.status, jsonContent: result.data.userId };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getUser(email) {
  try {
    const response = await axios.get(`${domain}/user/${email}`);
    return response.data.result;
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// create club with given name and master
async function createClub(clubName, id, clubPassword) {
  try {
    const response = await axios.post(`${domain}/club`, { clubName, id, clubPassword });
    return response.data;
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get all the clubs by userEmail and returns an array of [clubname, role]
async function getUserClubs(userEmail) {
  try {
    const result = await axios.get(`${domain}/clubs/${userEmail}`);
    return { status: result.status, jsonContent: result.data.clubsArray };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get specific club given the name of the club
async function getSpecificClub(clubName) {
  try {
    const result = await axios.get(`/club/${clubName}`);
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

module.exports = {
  register, login, getUserId, createClub, getSpecificClub, getUserClubs, getUser,
};
