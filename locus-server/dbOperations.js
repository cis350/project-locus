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
const checkIfEmailAlreadyExists = async (email) => {
  try {
    const user = await db.collection('Users').findOne({'email': email});
    if (!user) return true;
    return false;
  } catch(err) {
    console.error(err);
    throw new Error('email retrieval failed');
  }
};

// registers a user into backend
const registerUser = async (userFirstName, userLastName, userEmail, userPassword, userUniqueId) => {
  try {
    const userValues = {
      email: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
      password: userPassword,
      // clubs: [{clubID: x, isPM, boolean}, {clubID: y, isPM: boolean}, ...]
      clubs: [],
    }
    const result = await db.collection('Users').insertOne(userValues);
    if (!result.acknowledged){
      console.log('register to backend unsuccessful')
    }
  } catch(err) {
    console.error(err);
    throw new Error('unable to register user')
  }
};

// check if login infomation is correct
const verifyLoginInfo = async (userEmail, userPassword) => {
  try {
    const user = await db.collection('Users').findOne({'email': userEmail});
    if (user && user.password === userPassword) return true;
    return false;
  } catch(err) {
    console.error(err);
    throw new Error('unable to verify login infomation');
  }
};

const getUserUniqueId = async (userEmail) => {
  try {
    const user = await db.collection('Users').findOne({'email': userEmail});
    if (user) return user._id;
    console.log('user not found');
  } catch(err) {
    console.error(err);
    throw new Error('unable to get user id');
  }
};

const getUserFullName = async (userEmail) => {
  try {
    const user = await db.collection('Users').findOne({'email': userEmail});
    if (user) return `${user.firstName} ${user.lastName}`;
    console.log('user not found');
  } catch(err) {
    console.error(err);
    throw new Error('unable to get user full name');
  }
};

const getUserClub = async (userEmail) => {
  try {
    const user = await db.collection('Users').findOne({'email': userEmail});
    if (user) return user.clubs;
    console.log('user not found');
  } catch(err) {
    console.error(err);
    throw new Error('unable to get user clubs');
  }
};

/**
 * Chat Methods
 */


module.exports = {
    connect,
}
