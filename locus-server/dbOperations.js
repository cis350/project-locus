/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');

// url is the MongoDB url provided
const connect = async (url) => {
  try {
    const con = (
      await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    ).db();
    console.log('Connected to DB');
    return con;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to establish DB connection');
  }
};

/**
 * Login/Registration Methods
 */

// true if email already exists
const checkIfEmailAlreadyExists = async (db, email) => {
  try {
    const user = await db.collection('Users').findOne({ email: `${email}` });
    if (user) return true;
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('email retrieval failed');
  }
};

// registers a user into backend
const registerUser = async (
  db,
  userFirstName,
  userLastName,
  userEmail,
  userPassword,
  userUniqueId,
) => {
  try {
    const userValues = {
      _id: userUniqueId,
      email: userEmail,
      password: userPassword,
      firstName: userFirstName,
      lastName: userLastName,
      clubs: [],
    };

    const result = await db.collection('Users').insertOne(userValues);
    if (!result.acknowledged) {
      console.log('register to backend unsuccessful');
      return false;
    }
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('unable to register user');
  }
};

// check if login infomation is correct
const verifyLoginInfo = async (db, userEmail, userPassword) => {
  try {
    const user = await db.collection('Users').findOne({ email: `${userEmail}` });
    if (user && user.password === userPassword) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to verify login infomation');
  }
};

const getUserUniqueId = async (db, userEmail) => {
  try {
    const user = await db.collection('Users').findOne({ email: userEmail });
    if (user) return user._id;
    console.log('user not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get user id');
  }
};

const getUserFullName = async (db, userId) => {
  try {
    const user = await db.collection('Users').findOne({ _id: userId });
    if (user) {
      return user;
    }
    console.log('user not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get user full name');
  }
};

const getUserClub = async (db, userId) => {
  try {
    const user = await db.collection('Users').findOne({ _id: userId });
    if (user) return user.clubs;
    console.log('user not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get user clubs');
  }
};

/**
 * Chat Methods
 */

// addClubToChats equivalent create a chat for club
const createClubChat = async (db, clubName) => {
  try {
    const club = await db.collection('Clubs').findOne({ clubName });
    if (club) {
      // TODO: Create chat
      return;
    }
    console.log("couldn't find club to create chat");
  } catch (err) {
    console.error(err);
    throw new Error('unable to add a new club chat');
  }
};

const getClubChat = async (db, clubName) => {

};

const sendMessage = async (db, clubName, userEmail, message, timeStamp) => {

};

/**
 * Club Methods
 */

const createClub = async (db, newClubName, newMasterId) => {
  try {
    const club = await db.collection('Clubs').findOne({ clubName: `${newClubName}` });
    const masterName = await getUserFullName(db, newMasterId);
    if (!club) {
      const clubValues = {
        clubName: newClubName,
        masterId: newMasterId,
        masterName: `${masterName.firstName} ${masterName.lastName}`,
        // list of userIds associated with masters
        admins: [newMasterId],
        // list of projectIds associated with masters
        projects: [],
      };
      const result = await db.collection('Clubs').insertOne(clubValues);
      if (!result.acknowledged) {
        // to be caught by catch below
        throw new Error();
      }
      // good club creation
      return true;
    }
    console.log('club creation failed: clubname already exists');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to create new club');
  }
};

const getClub = async (db, clubName) => {
  try {
    const club = await db.collection('Clubs').findOne({ clubName: `${clubName}` });
    if (club) {
      // get data out without id
      return club;
    }
    console.log('club not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get club');
  }
};

// TODO: is this a duplicate of getUserClub?
// const getUserClubs = async (db, userId) => {
//   try {
//     const user = db.collection('Users').findOne({ _id: `${userId}` });
//     if (user) {
//       return user.clubs;
//     }
//     console.log('user not found');
//     return null;
//   } catch (err) {
//     console.error(err);
//     throw new Error('unable to get user\'t clubs');
//   }
// };

// TODO: Is the add to a club, or join?
const joinClub = async (db, userEmail, clubName, master) => {
  try {

  } catch (err) {
    console.error(err);
    throw new Error('unable to join club');
  }
};

module.exports = {
  connect,
  verifyLoginInfo,
  registerUser,
  getUserFullName,
  checkIfEmailAlreadyExists,
  getUserUniqueId,
  getUserClub,
  createClub,
  getClub,
  // getUserClubs,
};
