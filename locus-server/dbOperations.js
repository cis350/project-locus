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

const getUserClubs = async (db, userId) => {
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
      const chatValues = {
        'clubName': clubName,
        'messages': [],
      };
      const result = await db.collection('Chats').insertOne(chatValues);
      return result;
    }
    console.log("couldn't find club to create chat");
  } catch (err) {
    console.error(err);
    throw new Error('unable to add a new club chat');
  }
};

// get the chat of a club
const getClubChat = async (db, clubName) => {
  try {
    const chat = await db.collection('Chat').findOne({ clubName : `${clubName}` });
    if (chat) {
      return chat.messages;
    }
    console.log("couldn't find club to create chat");
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get club chat');
  }
};

// sends a message to a club chat
const sendMessage = async (db, clubName, userEmail, message, timeStamp, uniqueId) => {
  try {
    return db.collection('Clubs').updateOne({ clubName: `${clubName}`}, { $push: {messages: [userEmail, message, timeStamp, uniqueId]}})
  } catch (err) {
    console.error(err);
    throw new Error('unable to send message');
  }
};

/**
 * Club Methods
 */

// creates a new club
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

// return the values of a club
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


// add a user to an existing club
const joinClub = async (db, userEmail, clubName, master) => {
  try {
    const club = getClub(db, clubName);
    // master ~~ password -> add user to club
    if (club && club.master == master && !club.members.includes(userEmail)) {
      // update club side
      db.collection('Clubs').updateOne({clubName: `${clubName}`}, {$push: {members: userEmail}})
      // update user side
      db.collection('Users').updateOne({email: `${userEmail}`}, {$push: {clubs: `${clubName}`}})
      return club;
    }
    // club not found
    console.log('cannot join club (club not found)');
    return null;
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
  getUserClubs,
  createClub,
  getClub,
};
