const express = require('express');
const cors = require('cors');
const lib = require('./dbOperations');
// const e = require('express');

let db;
let url = 'mongodb+srv://cis350:rv1wLHpUDR94Bmmk@locus.cyx90.mongodb.net/Locus?retryWrites=true&w=majority';

// intialize web app with json
const webapp = express();

// enabling cors
webapp.use(cors());

// enabling json
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
webapp.post('/login', async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  try {
    const isSuccess = await lib.verifyLoginInfo(db, userEmail, userPassword);
    if (isSuccess) {
      const userId = await lib.getUserUniqueId(db, userEmail);
      return res.status(200).json({ message: 'Login successful', userId: `${userId}` });
    }
    return res.status(400).json({ error: 'Login unsucessful' });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.get('/id/:useremail', async (req, res) => {
  const requestedEmail = req.params.useremail;
  try {
    const userId = await lib.getUserUniqueId(db, requestedEmail);
    if (userId) {
      return res.status(200).json({ message: 'Id found', userId: `${userId}` });
    }
    return res.status(404).json({ error: 'Id not found' });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.get('/lockout/:useremail', async (req, res) => {
  const requestedEmail = req.params.useremail;
  try {
    const lockout = await lib.getLockoutStatus(db, requestedEmail);
    if (lockout) {
      return res.status(200).json({ message: 'Lockout date found', userLockout: `${lockout}` });
    }
    return res.status(404).json({ error: 'Lockout not found' });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.put('/lockoutupdate/:useremail/:lockout', async (req, res) => {
  const requestedEmail = req.params.useremail;
  const lockoutStatus = req.params.lockout;
  try {
    const lockout = await lib.setLockoutStatus(db, requestedEmail, lockoutStatus);
    if (lockout) {
      return res.status(200).json({ message: 'Lockout date updated' });
    }
    return res.status(404).json({ error: 'Lockout not updated' });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
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
      req.body.userYear,
      req.body.userMajor,
      req.body.lockoutStatus,
    );
    if (dbRes === null) {
      return res.status(403).json({ error: 'Forbidden POST' });
    }
    return res.status(201).json({ message: `${req.body.userFirstName} ${req.body.userLastName} added` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get userProfile with email as param, gets all JSON data
webapp.get('/user/:email', async (req, res) => {
  try {
    const dbRes = await lib.getUserProfile(db, req.params.email);
    if (dbRes === null) {
      return res.status(400).json({ error: 'Bad request' });
    }
    return res.status(200).json({ result: dbRes });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// clubs endpoints
// getClubs endpoint, get all clubs for a email as a body parameter
// getClubs needed for the chats endpoint too
webapp.get('/clubs/:email', async (req, res) => {
  try {
    const dbres = await lib.getUserClubs(db, req.params.email);
    if (dbres === null) {
      return res.status(400).json({ error: 'User not found' });
    }
    return res.status(200).json({ clubsArray: dbres });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// createClub endpoint, require clubName in req and :id param
webapp.put('/createClub/:id/:clubName', async (req, res) => {
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
    return res.status(200).json({ result: dbres });
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

// join a club using your email and a masterEmail
webapp.post('/joinclub/:clubname', async (req, res) => {
  const { userEmail, masterEmail } = req.body;
  const clubName = req.params.clubname;
  try {
    const result = await lib.joinClub(db, userEmail, clubName, masterEmail);
    if (result === null) {
      return res.status(400).json({ error: 'clubname or masterEmail incorrect' });
    }
    return res.status(201).json({ message: `added ${userEmail} to ${result.clubName}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.delete('/removeMember/:clubname', async (req, res) => {
  const { requestedEmail, targetEmail} = req.body;
  const clubName = req.params.clubname;
  try {
    const result = await lib.removeUserFromClub(db, clubName, requestedEmail, targetEmail);
    if (result) {
      return res.status(200).json({ message: `${targetEmail} removed from ${clubName}` });
    }
    return res.status(403).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// create a project for a parameter club name, project names must be unique
webapp.put('/project/:clubname', async (req, res) => {
  const { projectName, leaderEmail } = req.body;
  const clubName = req.params.clubname;
  try {
    const result = await lib.createProject(db, clubName, projectName, leaderEmail);
    if (result) {
      return res.status(201).json({ message: `Created ${projectName} for ${clubName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.post('/assignUsertoProject/:projectName', async (req, res) => {
  const { clubName, requestedEmail, assigneeEmail } = req.body;
  const { projectName } = req.params;
  try {
    const result = await lib.assignUserToProject(
      db,
      clubName,
      projectName,
      requestedEmail,
      assigneeEmail,
    );
    if (result) {
      return res.status(201).json({ message: `${assigneeEmail} added to ${projectName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.delete('/removeUsertoProject/:projectName', async (req, res) => {
  const { clubName, requestedEmail, assigneeEmail } = req.body;
  const { projectName } = req.params;
  try {
    const result = await lib.removeUserFromProject(
      db,
      clubName,
      projectName,
      requestedEmail,
      assigneeEmail,
    );
    if (result) {
      return res.status(200).json({ message: `${assigneeEmail} removed from ${projectName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.post('/project/:projectName', async (req, res) => {
  const { projectName } = req.params;
  const { clubName } = req.body;
  try {
    const dbRes = await lib.getProject(db, clubName, projectName);
    if (dbRes === null) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(200).json({ result: dbRes });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.delete('/deleteProject/:projectName', async (req, res) => {
  const { clubName, requestedEmail } = req.body;
  const { projectName } = req.params;
  try {
    const dbRes = await lib.deleteProject(db, clubName, projectName, requestedEmail);
    if (dbRes) {
      return res.status(200).json({ message: `Removed ${projectName} from ${clubName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function changeURL(inputURL) {
  url = inputURL;
}

// Start server; edit the port here if needed
const port = process.env.PORT || 3306;
webapp.listen(port, async () => {
  db = await lib.connect(url);
  console.log(`Server running on port:${port}`);
});

module.exports = { changeURL, webapp };
