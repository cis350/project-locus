const axios = require('axios');

const domain = 'http://localhost:3306';

// returns a boolean based on whether or not he login was successful
export async function login(email, password) {
  try {
    const response = await axios.post(`${domain}/login`, { email, password });
    if (response.data.message === 'Login successful') return true;
    return false;
  } catch (err) {
    return false;
  }
}

export async function getUser(email) {
  try {
    const response = await axios.get(`${domain}/login`, { email });
    if (response.data.message === 'Login successful') return true;
    return false;
  } catch (err) {
    return false;
  }
}
