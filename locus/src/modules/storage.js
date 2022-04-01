/**
 * Login/Registration Methods
 */

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

/**
 * Chat Methods
 */

function initChats() {
  localStorage.setItem('Chats', JSON.stringify({}));
}

// creates a new chat for a club
function addClubToChats(clubName) {
  const allClubChats = JSON.parse(localStorage.getItem('Chats'));
  allClubChats[clubName] = [];
  localStorage.setItem('Chats', JSON.stringify(allClubChats));
}

// returns the chat of a club, assume clubName exists (only called when clicked on existing club)
function getClubChat(clubName) {
  const allChats = JSON.parse(localStorage.getItem('Chats'));
  if (allChats && allChats[clubName]) {
    return allChats[clubName];
  }
  return null;
}

// sends a message to the chat of a club
function sendMessage(clubName, userEmail, message, timeStamp, uniqueId) {
  const allClubChats = JSON.parse(localStorage.getItem('Chats'));
  const clubChats = getClubChat(clubName);
  clubChats.push([userEmail, message, timeStamp, uniqueId]);
  allClubChats[clubName] = clubChats;
  localStorage.setItem('Chats', JSON.stringify(allClubChats));
}

/**
 * Club Methods
 */

function createClub(clubName, master, uniqueId) {
  if (!localStorage.getItem('Clubs')) {
    localStorage.setItem('Clubs', JSON.stringify({}));
  }
  const clubValues = {
    clubName: clubName,
    master: master,
    uniqueId: uniqueId,
    members: [master],
    projects: {},
  };
  // update club side
  const clubs = JSON.parse(localStorage.getItem('Clubs'));
  clubs[clubName] = clubValues;
  localStorage.setItem('Clubs', JSON.stringify(clubs));

  if (!localStorage.getItem('Chats')) {
    initChats();
  }

  addClubToChats(clubName);
}

// Return club values
function getClub(clubName) {
  const clubs = JSON.parse(localStorage.getItem('Clubs'));
  if (clubs && clubs[clubName]) {
    return clubs[clubName];
  }
  return null;
}

// return array of clubs user is in
function getUserClubs(userEmail) {
  const userValues = JSON.parse(localStorage.getItem(userEmail));
  return userValues.clubs;
}

function joinClub(userEmail, clubName, master, uniqueId) {
  const clubValues = getClub(clubName);
  if (!clubValues) {
    createClub(clubName, userEmail, uniqueId);
    // update user side
    const userValues = JSON.parse(localStorage.getItem(userEmail));
    userValues.clubs.push(clubName);
    localStorage.setItem(userEmail, JSON.stringify(userValues));
    return getClub(clubName);
  }
  // master ~~ password -> add user to club
  if (clubValues.master === master && !clubValues.members.includes(userEmail)) {
    // update club side
    clubValues.members.push(userEmail);
    const clubs = JSON.parse(localStorage.getItem('Clubs'));
    clubs[clubName] = clubValues;
    localStorage.setItem('Clubs', JSON.stringify(clubs));

    // update user side
    const userValues = JSON.parse(localStorage.getItem(userEmail));
    userValues.clubs.push(clubName);
    localStorage.setItem(userEmail, JSON.stringify(userValues));
    return getClub(clubName);
  }
  return null;
}

module.exports = {
  checkIfEmailAlreadyExists,
  registerUser,
  verifyLogInInfo,
  getUserUniqueId,
  getUserFullName,
  getUserClubs,
  joinClub,
  getClub,
  getClubChat,
  sendMessage,
};
