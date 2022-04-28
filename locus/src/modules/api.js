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
    })
    return { status: result.status, jsonContent: result.data };
  } catch(err) {
    return null;
  }
}

async function login(userEmail, userPassword) {
  try {
    const result = await axios.post(`${domain}/login`, { email: userEmail, password: userPassword });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return "Server Failure"
  }
}

async function getUserId(userEmail) {
  const result = await axios.get(`/id/${userEmail}`);
  return { status: result.status, jsonContent: result.data };
}

// create club with given name and master
async function createClub(clubName, masterId) {
  const result = await axios.post('/club', { clubName, id: masterId});
  return { status: result.status, jsonContent: result.data };
}

// get all the clubs by userEmail and returns an array of [clubname, role]
async function getUserClubs(userEmail) {
  const result = await axios.get(`/club/${userEmail}`);
  return { status: result.status, jsonContent: result.data };
}

// get specific club given the name of the club
async function getSpecificClub(clubName) {
  const result = await axios.get(`/club/${clubName}`);
  return { status: result.status, jsonContent: result.data };
}

module.exports = {
  register, login, getUserId, createClub, getSpecificClub, getUserClubs,
};
