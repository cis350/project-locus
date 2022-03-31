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

// returns the chat of a club
function getClubChats(clubName) {
  const allChats = JSON.parse(localStorage.getItem('Chat'));
  if (allChats && allChats[clubName]) {
    return JSON.parse(localStorage.getItem('Chats'))[clubName];
  }
  return null;
}

// sends a message to the chat of a club
function sendMessage(clubName, userEmail, message, timeStamp) {
  const allClubChats = JSON.parse(localStorage.getItem('Chats'));
  const clubChats = getClubChats(clubName);
  clubChats.push([ userEmail, message, timeStamp ]);
  allClubChats[clubName] = clubChats;
  localStorage.setItem('Chats', JSON.stringify(allClubChats));
}

// function searchList(arr, target) {
//   for (let i = 0; i < arr.length; i += 1) {
//     if (arr[i] === target) {
//       return arr[i];
//     }
//   }
//   return null;
// }

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
    console.log(userValues);
    localStorage.setItem(userEmail, JSON.stringify(userValues));
    return getClub(clubName);
  }
  // master ~~ password -> add user to club
  if (clubValues.master === master && !clubValues.members.contains(userEmail)) {
    console.log('master reached');
    // update club side
    clubValues.members.push(userEmail);
    const clubs = JSON.parse(localStorage.getItem('Clubs'));
    clubs[clubName] = clubValues;
    localStorage.setItem('Clubs', JSON.stringify(clubs));

    console.log('user side reached');
    // update user side
    const userValues = JSON.parse(localStorage.getItem(userEmail));
    userValues.clubs.push(clubName);
    console.log(userValues);
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
  getClubChats,
  sendMessage,
};
