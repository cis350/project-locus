async function register(firstName, lastName, email, password, year, major) {
  const result = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      userPassword: password,
      userYear: year,
      userMajor: major,
    }),
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function login(userEmail, userPassword) {
  const result = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      password: userPassword,
    }),
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function getUserId(userEmail) {
  const result = await fetch(`/id/${userEmail}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

// create club with given name and master
async function createClub(clubName, masterId) {
  const result = await fetch('/club', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clubName,
      id: masterId,
    }),
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

// get all the clubs by userEmail and returns an array of [clubname, role]
async function getUserClubs(userEmail) {
  const result = await fetch(`/club/${userEmail}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

// get specific club given the name of the club
async function getSpecificClub(clubName) {
  const result = await fetch(`/club/${clubName}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

module.exports = {
  register, login, getUserId, createClub, getSpecificClub, getUserClubs,
};
