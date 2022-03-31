import { v4 as uuidv4 } from 'uuid';

function checkIfEmailAlreadyExists(email) {
  return !localStorage.getItem(email);
}

const registerUser = (userFirstName, userLastName, userEmail, userPassword, userUniqueId) => {
  const userValues = {
    firstName: userFirstName,
    lastName: userLastName,
    password: userPassword,
    uniqueId: userUniqueId,
    clubs: [],
  };
  localStorage.setItem(userEmail, JSON.stringify(userValues));
};

function verifyLogInInfo(userEmail, userPassword) {
  if (!localStorage.getItem(userEmail)
  || JSON.parse(localStorage.getItem(userEmail)).password !== userPassword) {
    return false;
  }
  return true;
}

function getUserUniqueId(userEmail) {
  return JSON.parse(localStorage.getItem(userEmail)).uniqueId;
}

function getUserFullName(userEmail) {
  const first = JSON.parse(localStorage.getItem(userEmail)).firstName;
  const last = JSON.parse(localStorage.getItem(userEmail)).lastName;
  return `${first} ${last}`;
}

function createClub(clubName, master) {
  if (!localStorage.get('Clubs')){
    localStorage.setItem('Clubs', JSON.stringify({}));
  }
  const clubValues = {
    clubName: clubName,
    master: master,
    uniqueId: uuidv4(),
    members: [master],
    projects: {},
  };
  const clubs = JSON.parse(localStorage.get('Clubs'));
  clubs[clubName] = clubValues;
  localStorage.setItem('Clubs', JSON.stringify(clubs));
}

function joinClub(userEmail, clubName, master) {
  const clubValues = getClub(clubName);
  if (!clubValues){
    createClub(clubName, userEmail);
  } else if (clubValues.master === master) {        // master ~~ password -> add user to club
    // update club side
    clubValues.members.push(userEmail);
    const clubs = JSON.parse(localStorage.get('Clubs'));
    clubs[clubName] = clubValues;
    localStorage.setItem('Clubs', JSON.stringify(clubs));

    // update user side
    const userValues = JSON.parse(localStorage.get(userEmail));
    userValues.clubs.push(clubName);
    localStorage.set(userEmail, JSON.stringify(userValues));
  }
}

// Return club values
function getClub(clubName) {
  const clubs = JSON.parse(localStorage.get('Clubs'));
  if (clubs && clubs.clubName) {
    return clubs.clubName;
  }
  return null;
}

module.exports = {
  checkIfEmailAlreadyExists,
  registerUser,
  verifyLogInInfo,
  getUserUniqueId,
  getUserFullName,
};
