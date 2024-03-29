/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const lib = require('./dbOperations');

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

/*
 * Login and Registraition Routes
 */

// login endpoint, verifies given login using Request body
webapp.post('/login', async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const currTime = Date.now();
  const lockoutInterval = 5 * 60 * 1000;
  try {
    const user = await lib.verifyLoginInfo(db, userEmail, userPassword, currTime, lockoutInterval);
    // user not found
    if (user === null) {
      return res.status(404).json({ error: 'User not found' });
    }
    // lockout is you are not within the time interval and lockoutAttempts is >= 3
    if (user.lockoutDate > currTime && user.lockoutAttempts >= 3) {
      return res.status(403).json({ error: `Account for ${userEmail} locked` });
    }
    // if your lockout attempts are less than three, but greater than 0, you must have bad login
    if (user.lockoutAttempts > 0) {
      return res.status(400).json({ error: `Incorrect password for ${userEmail}` });
    }
    // else if your lockoutAttempts are set to 0, send back login infor
    const userId = await lib.getUserUniqueId(db, userEmail);
    return res.status(200).json({ message: `Login successful for ${userEmail}`, userId: `${userId}` });
  } catch (e) {
    console.error(e);
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
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// reset password route
webapp.put('/resetPassword/:useremail', async (req, res) => {
  const { password } = req.body;
  const { useremail } = req.params;
  const currTime = Date.now();
  try {
    const dbRes = await lib.resetPassword(db, useremail, password, currTime);
    if (dbRes) {
      return res.status(201).json({ message: `Password reset for ${useremail}` });
    }
    return res.status(404).json({ error: 'Failed to reset password' });
  } catch (e) {
    console.error(e);
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
      Date.now(),
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

/*
 * Chat Routes
 */

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

// send message route
webapp.post('/chats/:clubName', async (req, res) => {
  const { clubName } = req.params;
  const {
    email, message, content, time,
  } = req.body;
  const newUid = uuidv4();
  try {
    const dbres = await lib.sendMessage(db, clubName, email, message, content, time, newUid);
    if (dbres) {
      return res.status(201).json({ message: 'Message sent' });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get user notifications
webapp.get('/notifications/:userEmail', async (req, res) => {
  try {
    const dbres = await lib.getUnreadNotifications(db, req.params.userEmail);
    if (dbres === null) {
      return res.status(400).json({ error: 'User not found' });
    }
    // this is returned as a large json object
    return res.status(200).json({ notifications: dbres });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// set notifications as read
webapp.put('/notifications/:clubName', async (req, res) => {
  const { requestedEmail } = req.body;
  try {
    const result = await lib.makeNotificationsRead(db, requestedEmail, req.params.clubName);
    if (!result) {
      return res.status(403).json({ error: 'Invalid request' });
    }
    return res.status(200).json({ message: `Notifications for ${requestedEmail} updated for in ${req.params.clubName}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
 * Club Routes
 */

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

// create club endpoint, require clubName in req and :id param
webapp.post('/club', async (req, res) => {
  try {
    const dbres = await lib.createClub(db, req.body.clubName, req.body.id, req.body.clubPassword);
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

// join a club using your email and a password
webapp.post('/joinclub/:clubname', async (req, res) => {
  const { userEmail, password } = req.body;
  const clubName = req.params.clubname;
  try {
    const result = await lib.joinClub(db, userEmail, clubName, password);
    if (result === null) {
      return res.status(400).json({ error: 'clubname or password incorrect' });
    }
    return res.status(201).json({ message: `added ${userEmail} to ${result.clubName}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.delete('/removeMember/:clubname', async (req, res) => {
  const { requestedEmail, targetEmail } = req.body;
  if (requestedEmail === targetEmail) {
    return res.status(403).json({ error: 'Cannot remove self' });
  }
  const clubName = req.params.clubname;
  try {
    const result = await lib.removeUserFromClub(db, clubName, requestedEmail, targetEmail);
    if (result) {
      return res.status(200).json({ message: `${targetEmail} removed from ${clubName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// promote user request
webapp.put('/promotemember/:clubname', async (req, res) => {
  const { requestedEmail, targetEmail } = req.body;
  if (requestedEmail === targetEmail) {
    return res.status(403).json({ error: 'Cannot promote self' });
  }
  const clubName = req.params.clubname;
  try {
    const result = await lib.promoteUserToAdmin(db, clubName, requestedEmail, targetEmail);
    if (result === null) {
      return res.status(403).json({ error: 'Invalid request' });
    }
    return res.status(200).json({ message: `${targetEmail} promoted in ${clubName}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
 * Project Routes
 */

// create a project for a parameter club name, project names must be unique
webapp.put('/project/:clubname', async (req, res) => {
  const { projectName, leaderEmail, requestedEmail } = req.body;
  const clubName = req.params.clubname;
  try {
    if (await lib.userIsClubAdmin(db, clubName, requestedEmail)) {
      const result = await lib.createProject(db, clubName, projectName, leaderEmail);
      if (result) {
        return res.status(201).json({ message: `Created ${projectName} for ${clubName}` });
      }
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get all the projects for a given club
webapp.get('/projects/:clubname', async (req, res) => {
  const clubName = req.params.clubname;
  try {
    const resultArray = await lib.getProjectsForClub(db, clubName);
    if (resultArray === null) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    return res.status(200).json({ result: resultArray });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// assign a user to a project
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

// delete a user from a specific project
webapp.delete('/removeUserFromProject/:projectName', async (req, res) => {
  const {
    clubName,
    requestedEmail,
    assigneeEmail,
    leaderEmail,
  } = req.body;
  const { projectName } = req.params;
  try {
    const result = await lib.removeUserFromProject(
      db,
      clubName,
      projectName,
      requestedEmail,
      assigneeEmail,
      leaderEmail,
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

// get's a specific project
webapp.post('/project/:projectName', async (req, res) => {
  const { projectName } = req.params;
  const { clubName } = req.body;
  console.log(projectName);
  console.log(clubName);
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

/*
 * Task Routes:
 */

// reassign tasks route
webapp.put('/reassignTask/:taskid', async (req, res) => {
  const {
    clubName,
    projectName,
    requestedEmail,
    targetEmail,
  } = req.body;
  const { taskid } = req.params;
  try {
    const dbRes = await lib.reassignTask(
      db,
      clubName,
      projectName,
      taskid,
      requestedEmail,
      targetEmail,
    );
    if (dbRes) {
      return res.status(200).json({ message: `Reassigned ${taskid} of ${projectName} to ${targetEmail}` });
    }
    if (dbRes === null) {
      return res.status(404).json({ error: `Task with id:${taskid} not found` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// create task route
webapp.post('/createTask/:projectName', async (req, res) => {
  const {
    clubName, taskName, requestedEmail, targetEmail, status,
  } = req.body;
  const { projectName } = req.params;
  try {
    const dbRes = await lib.createTask(
      db,
      clubName,
      projectName,
      taskName,
      requestedEmail,
      targetEmail,
      status,
    );
    if (dbRes) {
      return res.status(201).json({ message: `Created ${taskName} for ${projectName} assigned to ${targetEmail}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get all tasks for a project
webapp.post('/tasks/:projectName', async (req, res) => {
  const { clubName, requestedEmail } = req.body;
  const { projectName } = req.params;
  try {
    const tasks = await lib.getAllTasksForProject(db, clubName, projectName, requestedEmail);
    if (tasks) {
      return res.status(200).json({ result: tasks });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get all ongoing tasks for a project
webapp.post('/ongoingProjectTasks/:projectName', async (req, res) => {
  const { clubName, requestedEmail } = req.body;
  const { projectName } = req.params;
  try {
    const tasks = await lib.getOngoingTasksForProject(db, clubName, projectName, requestedEmail);
    if (tasks) {
      return res.status(200).json({ result: tasks });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get all ongoing tasks for a club
webapp.get('/allOngoingTasks/:clubName', async (req, res) => {
  const { clubName } = req.params;
  try {
    const allTasks = await lib.getAllOngoingTasksForClub(db, clubName);
    if (allTasks) {
      return res.status(200).json({ result: allTasks });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get a specific task
webapp.post('/task/project/:taskId', async (req, res) => {
  const { clubName, projectName, requestedEmail } = req.body;
  const { taskId } = req.params;
  try {
    const task = await lib.getTask(db, clubName, projectName, requestedEmail, taskId);
    if (task) {
      return res.status(200).json({ result: task });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// update status for a specific task
webapp.put('/updateTaskStatus/:taskId', async (req, res) => {
  const {
    clubName, projectName, requestedEmail, newStatus,
  } = req.body;
  const { taskId } = req.params;
  try {
    const updateSuccess = await lib.updateTaskStatus(
      db,
      clubName,
      projectName,
      taskId,
      requestedEmail,
      newStatus,
    );
    if (updateSuccess) {
      return res.status(200).json({ message: `Updated ${taskId} to ${newStatus}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// delete tasks with given id, club, and projectName
webapp.delete('/deleteTask/:taskId', async (req, res) => {
  const { clubName, projectName, requestedEmail } = req.body;
  const { taskId } = req.params;
  try {
    const dbRes = await lib.removeTaskFromProject(
      db,
      clubName,
      projectName,
      taskId,
      requestedEmail,
    );
    if (dbRes) {
      return res.status(200).json({ message: `Removed ${taskId} from ${projectName}` });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
 * Analytics Route
 */
webapp.post('/projectAnalytics/:projectName', async (req, res) => {
  const { clubName } = req.body;
  const { projectName } = req.params;
  try {
    const allCompletedTasks = await lib.getCompletedTasks(db, clubName, projectName);
    if (allCompletedTasks) {
      const aggregationResult = await lib.getCompletedTasksByUsers(db, clubName, projectName);
      if (aggregationResult) {
        const twoArrays = {
          completedTasks: allCompletedTasks,
          taskCompletedByPerson: aggregationResult,
        };
        return res.status(200).json({ results: twoArrays });
      }
      return res.status(400).json({ error: 'Invalid request' });
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
