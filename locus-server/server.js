const express = require('express');
// const req = require('express/lib/request');

const lib = require('./dbOperations');

let db;
const url = 'mongodb+srv://cis350:rv1wLHpUDR94Bmmk@locus.cyx90.mongodb.net/Locus?retryWrites=true&w=majority';

// intialize web app with json
const webapp = express();
webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

// root endpoint
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to locus!' });
});

// login endpoint, verifies given login using Request body
webapp.get('/login', async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  try {
    const isSuccess = await lib.verifyLoginInfo(db, userEmail, userPassword);
    if (isSuccess) {
      const userId = await lib.getUserUniqueId(db, userEmail);
      res.status(200).json({ message: 'Login successful', userId: `${userId}` });
    } else {
      res.status(400).json({ error: 'Login unsucessful' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// register, creates a user using Request body
webapp.post('/register', async (req, res) => {
  try {
    const emailExists = await lib.checkIfEmailAlreadyExists(db, req.body.userEmail);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const dbRes = await lib.registerUser(
      db,
      req.body.userFirstName,
      req.body.userLastName,
      req.body.userEmail,
      req.body.userPassword,
      req.body.userUniqueId,
    );
    if (dbRes.insertedId === req.body.userUniqueId) {
      return res.status(201).json({ message: `${req.body.userFirstName} ${req.body.userLastName} added` });
    }
    return res.status(403).json({ error: 'Forbidden POST' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// home w/ profile with user id as a parameter, gets full name as json
webapp.get('/home/:id', async (req, res) => {
  try {
    const dbRes = await lib.getUserFullName(db, req.params.id);
    if (dbRes === null) {
      res.status(400).json({ error: 'Bad request' });
    } else {
      res.status(200).json({ firstName: dbRes.firstName, lastName: dbRes.lastName });
      console.log(dbRes);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// clubs endpoints

// getClubs endpoint, get all clubs for a userId as parameter
// getClubs needed for the chats endpoint too
webapp.get('/clubs/:id', async (req, res) => {
  try {
    const dbres = await lib.getUserClubs(db, req.params.id);
    if (dbres === null) {
      return res.status(400).json({ error: 'User not found' });
    }
    return res.status(200).json({ clubsArray: dbres }); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// createClub endpoint, require clubName in req and :id param
webapp.post('/createClub/:id/:clubName', async (req, res) => {
  try {
    const dbres = await lib.createClub(db, req.body.clubName, req.params.id);
    if (dbres) {
      return res.status(200).json({ message: `Club created with name ${req.body.clubName}` });
    }
    return res.status(400).json({ error: 'Club name already exists' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// getClub endpoint, use this to get a specific club by clubName
webapp.get('/club/:clubName', async (req, res) => {
  try {
    const dbres = await lib.getClub(db, req.params.clubName);
    if (dbres === null) {
      return res.status(400).json({ error: 'Club name does not exist' });
    }
    // this is returned as a large json object
    return res.status(200).json({ clubObject: dbres });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// chat endpoint, use this to get the chat log of a specific club by Clubname
webapp.get('/chats/:clubName', async (req, res) => {
  try {
    const dbres = await lib.getClubChat(db, req.params.clubName);
    if (dbres === null) {
      return res.status(400).json({ error: 'Club name does not exist' });
    }
    // this is returned as a large json object
    return res.status(200).json({ clubObject: dbres });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO: duplicate of clubs enpoint
// // getUserClubs endpoint, use this to get a set of clubs for a user
// webapp.get('/userclubs/:id', async (req, res) => {
//   try {
//     const dbres = await lib.getClub(db, req.params.clubName);
//     if (dbres === null) {
//       return res.status(400).json({ error: 'Club name does not exist' });
//     }
//     // this is returned as a large json object
//     return res.status(200).json({ clubObject: dbres });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Start server; edit the port here if needed
const port = process.env.PORT || 3306;
webapp.listen(port, async () => {
  db = await lib.connect(url);
  console.log(`Server running on port:${port}`);
});

module.exports = webapp;
