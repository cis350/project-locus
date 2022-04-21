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

// addClubToChats equivalent create a chat for club
const createClubChat = async (clubName) => {
  try {
    const club = await db.collection('Clubs').findOne({'clubName': clubName});
    if (club) {
      // TODO: Create chat
      return; 
    } 
    console.log("could't find club to create chat")
  } catch(err) {
    console.error(err);
    throw new Error('unable to add a new club chat');
  }
}

const getClubChat = async (clubName) => {

};

const sendMessage = async (clubName, userEmail, message, timeStamp) => {

};


/**
 * Club Methods
 */

const createClub = async (clubName, master) => {
  try {
    const club = db.collection('Clubs').findOne({'clubName': clubName});
    const user = db.collection('Users').findOne({'email': master});
    if (!club) {
      clubValues = {
        clubName: clubName,
        master: master,
        masters: [user._id],
        projects: [],
      }
      const result = db.collection('Clubs').insertOne(clubValues);
      if (!result.acknowledged){
        console.log('datebase: club creation unsuccessful');
      }
      return;
    }
    console.log('club creation failed: clubname already exists');
  } catch(err) {
    console.error(err);
    throw new Error('unable to create new club');
  }
};

const getClub = async (clubName) => {
  try {
    const club = db.collection('Clubs').getOne({'clubName': clubName})
    if (club) return club;
    console.log('club not found');
  } catch(err) {
    console.error(err);
    throw new Error('unable to get club');
  }
}

const getUserClubs = async (userEmail) => {
  try {
    const user = db.collection('Users').getOne({'email': userEmail});
    if (user) {
      return user.clubs;
    }
    console.log('user not found');
  } catch(err) {
    console.error(err);
    throw new Error('unable to get user\'t clubs');
  }
}

const joinClub = async (userEmail, clubName, master) => {
  try {
    
  } catch(err) {
    console.error(err);
    throw new Error('unable to join club');
  }
}


module.exports = {
    connect,
}
