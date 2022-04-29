const axios = require('axios');

const domain = 'https://testbackendforproject.herokuapp.com';

// returns a boolean based on whether or not he login was successful
export async function login(email, password) {
  try {
    const response = await axios.post(`${domain}/login`, { email, password });
    if (response.status === 200) return 200;
    return 400;
  } catch (err) {
    return err.response.status;
  }
}

export async function getUser(email) {
  try {
    const response = await axios.get(`${domain}/user/${email}`);
    return response.data;
  } catch (err) {
    return false;
  }
}

export async function createClub(clubName) {
  try {
    const response = await axios.post(`${domain}/createClub/${clubName}`);
    return response.data;
  } catch (err) {
    return false;
  }
}
