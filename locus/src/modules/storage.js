function checkIfEmailAlreadyExists(email) {
  return !localStorage.getItem(email);
}

const registerUser = (userFirstName, userLastName, userEmail, userPassword, userUniqueId) => {
  const userValues = {
    firstName: userFirstName,
    lastName: userLastName,
    password: userPassword,
    uniqueId: userUniqueId,
    // clubs: [{clubID: x, isPM, boolean}, {clubID: y, isPM: boolean}, ...]
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

function getUserClub(userEmail) {
  return JSON.parse(localStorage.getItem(userEmail)).clubs;
}

module.exports = {
  checkIfEmailAlreadyExists,
  registerUser,
  verifyLogInInfo,
  getUserUniqueId,
  getUserFullName,
  getUserClub,
};
