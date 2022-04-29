/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid');

const salt = bcrypt.genSaltSync(10);

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
const checkIfEmailAlreadyExists = async (db, userEmail) => {
  try {
    if (!db || !userEmail) return false;
    const user = await db.collection('Users').findOne({ email: userEmail });
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
  userYear,
  userMajor,
  registerDate,
) => {
  try {
    if (!db || !userFirstName || !userLastName
      || !userEmail || !userPassword || !userYear || !userMajor || !registerDate) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    const userValues = {
      email: userEmail,
      password: hashedPassword,
      firstName: userFirstName,
      lastName: userLastName,
      year: userYear,
      major: userMajor,
      registrationDate: registerDate,
      lockoutAttempts: 0,
      lockoutDate: registerDate,
      clubs: [],
    };
    const emailExists = await checkIfEmailAlreadyExists(userEmail);
    if (!emailExists) {
      const result = await db.collection('Users').insertOne(userValues);
      if (result) {
        return result;
      }
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to register user');
  }
};

// check if login infomation is correct; date = now
const verifyLoginInfo = async (db, userEmail, userPassword, date, lockoutInterval) => {
  try {
    if (!db || !userEmail || !userPassword || !date || !lockoutInterval) return null;
    const emailExists = await checkIfEmailAlreadyExists(db, userEmail);
    if (emailExists) {
      const user = await db.collection('Users').findOne({ email: userEmail });
      if (user) {
        if (date > user.lockoutDate) {
          // sucessful login outside lockoutInterval
          if (await (bcrypt.compare(userPassword, user.password))) {
            await db.collection('Users').updateOne({ email: userEmail }, { $set: { lockoutAttempts: 0 } });
          } else if (user.lockoutAttempts < 3) {
            // if not locked out yet and bad password increment attempts by 1
            const newAttemptsNum = user.lockoutAttempts + 1;
            await db.collection('Users').updateOne({ email: userEmail }, { $set: { lockoutAttempts: newAttemptsNum } });
          } else {
            // attempts is at least than 3, so set a lockoutTime
            await db.collection('Users').updateOne({ email: userEmail }, { $set: { lockoutDate: date + lockoutInterval } });
          }
        }
        // make no changes to object if still within lockoutInterval
        return await db.collection('Users').findOne({ email: userEmail });
      }
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to verify login infomation');
  }
};

const getUserUniqueId = async (db, userEmail) => {
  try {
    if (!db || !userEmail) return null;
    const user = await db.collection('Users').findOne({ email: userEmail });
    if (user) {
      return user._id.toString();
    }
    console.log('user not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get user id');
  }
};

const getUserProfile = async (db, userEmail) => {
  try {
    if (!db || !userEmail) return null;
    const user = await db.collection('Users').findOne({ email: userEmail });
    if (user) {
      const userOnlyData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        year: user.year,
        major: user.major,
        clubs: user.clubs,
      };
      return userOnlyData;
    }
    console.log(`user with ${userEmail} not found`);
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get user full name');
  }
};

const getUserClubs = async (db, userEmail) => {
  try {
    if (!db || !userEmail) return null;
    const user = await db.collection('Users').findOne({ email: userEmail });
    if (user) {
      return user.clubs;
    }
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
const createClubChat = async (db, newClubName) => {
  try {
    if (!db || !newClubName) return false;
    const club = await db.collection('Clubs').findOne({ clubName: newClubName });
    if (club) {
      const chatValues = {
        clubId: club._id,
        clubName: newClubName,
        messages: [],
      };
      console.log(newClubName, 'chat created');
      const result = await db.collection('Chats').insertOne(chatValues);
      if (!result.acknowledged) {
        return false;
      }
      return true;
    }
    console.log("couldn't find club to create chat");
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to add a new club chat');
  }
};

// get the chat of a club, creates a chat array if needed
const getClubChat = async (db, clubName) => {
  try {
    if (!db || !clubName) return null;
    const chat = await db.collection('Chats').findOne({ clubName });
    if (chat) {
      return chat.messages;
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get club chat');
  }
};

// sends a message to a club chat (true for success, false for failure)
const sendMessage = async (db, clubName, userEmail, message, timeStamp, uniqueId) => {
  try {
    if (!db || !clubName || !userEmail || !message || !timeStamp || !uniqueId) return false;
    const chat = db.collection('Chats').findOne({ clubName });
    if (chat) {
      await db.collection('Clubs').updateOne(
        { clubName },
        {
          $push:
          {
            messages:
            {
              userEmail, message, timeStamp, uniqueId,
            },
          },
        },
      );
      return true;
    }
    console.log('chat not found');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to send message');
  }
};

/**
 * Club Methods
 */

// creates a new club
const createClub = async (db, newClubName, masterId, clubPassword) => {
  try {
    if (!db || !newClubName || !masterId || !clubPassword) return false;
    const club = await db.collection('Clubs').findOne({ clubName: `${newClubName}` });
    const user = await db.collection('Users').findOne({ _id: ObjectId(masterId) });
    const masterName = `${user.firstName} ${user.lastName}`;
    if (!club) {
      const clubValues = {
        clubName: newClubName,
        masterEmail: user.email,
        masterName,
        // list of user emails associated with masters
        admins: [user.email],
        // list of project names associated with this club
        projects: [],
        // list of member user emails associated with this club
        members: [user.email],
        password: clubPassword,
      };
      const clubResult = await db.collection('Clubs').insertOne(clubValues);
      const chatResult = await createClubChat(db, newClubName);
      const newClubUserObject = { clubName: newClubName, role: 'master' };
      const userResult = await db.collection('Users').updateOne({ _id: ObjectId(masterId) }, { $push: { clubs: newClubUserObject } });
      if (!clubResult.acknowledged || !userResult.acknowledged || !chatResult) {
        console.log('create club not acknowledged');
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
    if (!db || !clubName) return null;
    const club = await db.collection('Clubs').findOne({ clubName: `${clubName}` });
    if (club) {
      delete club._id;
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
const joinClub = async (db, userEmail, clubName, password) => {
  try {
    if (!db || !userEmail || !clubName || !password) return null;
    const club = await getClub(db, clubName);
    // master ~~ password -> add user to club
    if (club && club.password === password && !club.members.includes(userEmail)) {
      // update club side
      const clubResult = await db.collection('Clubs').updateOne({ clubName: `${clubName}` }, { $push: { members: userEmail } });
      // update user side
      const userResult = await db.collection('Users').updateOne({ email: `${userEmail}` }, { $push: { clubs: `${clubName}` } });
      if (!clubResult.acknowledged || !userResult.acknowledged) throw new Error('not acknowledged');
      return club;
    }
    // club not found or wrong password or member is already in
    console.log('cannot join club (club not found)');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to join club');
  }
};

// allow admins to remove a user from club (true for success)
const removeUserFromClub = async (db, clubName, requestedEmail, targetEmail) => {
  try {
    if (!db || !clubName || !requestedEmail || !targetEmail) return false;
    const club = await getClub(db, clubName);
    if (club && club.admins.includes(requestedEmail)
      && club.members.includes(targetEmail) && !club.admins.includes(targetEmail)) {
      // remove user from club
      const removeFromClub = await db.collection('Clubs').updateOne({ clubName }, { $pull: { members: targetEmail } });
      // remove user from any project
      const projectsOfUser = await db.collectin('Projects').updateMany(
        { clubName, members: targetEmail },
        { $pull: { members: targetEmail } },
      );
      // update user's club involvement
      const userClubUpdate = await db.collection('Users').updateOne({ targetEmail }, { $pull: { clubs: clubName } });
      if (!removeFromClub.acknowledged || !projectsOfUser.acknowledged
        || !userClubUpdate.acknowledged) {
        console.log('user remove from club: something did not update correctly, check backend');
        return false;
      }
      return true;
    }
    console.log('user removal from club criteria not met');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to remove user from club');
  }
};

/**
 * Project Methods
 */

// creates a project (true for success)
const createProject = async (db, clubName, projectName, leaderEmail) => {
  try {
    if (!db || !clubName || !projectName || !leaderEmail) return false;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    if (!project) {
      const projectValues = {
        projectName,
        clubName,
        leaderEmail,
        members: [leaderEmail],
        tasks: [],
      };
      const result = await db.collection('Projects').insertOne(projectValues);
      if (!result.acknowledged) {
        console.log('create project not acknowledged');
        return false;
      }
      // update club project lists
      const club = await db.collection('Club').updateOne({ clubName }, { $push: { projects: projectName } });
      if (!club.acknowledged) {
        return false;
      }
      return true;
    }
    console.log('there is another project of the same name');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to create project');
  }
};

// assigns assigneeEmail to project if authorized (true for success)
const assignUserToProject = async (db, clubName, projectName, requestedEmail, assigneeEmail) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail || !assigneeEmail) return false;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    const club = await db.collection('Clubs').findOne({ clubName });
    // check authorization
    if (club && project && (club.admins.includes(requestedEmail)
      || project.leaderEmail === requestedEmail) && club.members.includes(assigneeEmail)) {
      const result = await db.collection('Projects').updateOne({ clubName, projectName }, { $push: { members: assigneeEmail } });
      if (!result.acknowledged) {
        console.log('project assignment not acknowledged');
        return false;
      }
      return true;
    }
    console.log('user not authorized');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error(`unable to assign ${assigneeEmail} to project`);
  }
};

const removeUserFromProject = async (db, clubName, projectName, requestedEmail, targetEmail) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail || !targetEmail) return false;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    const club = await db.collection('Clubs').findOne({ clubName });
    // check authorization
    if (club && project && (club.admins.includes(requestedEmail)
      || project.leaderEmail === requestedEmail) && project.members.includes(targetEmail)) {
      const result = await db.collection('Projects').updateOne({ clubName, projectName }, { $pull: { members: targetEmail } });
      if (!result.acknowledged) {
        console.log('project user removal not acknowledged');
        return false;
      }
      return true;
    }
    console.log('user not authorized');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error(`unable to assign ${targetEmail} to project`);
  }
};

// returns project values without id (null if failed)
const getProject = async (db, clubName, projectName) => {
  try {
    if (!db || !clubName || !projectName) return null;
    const project = await db.collection('Project').findOne({ clubName, projectName });
    if (project) {
      delete project._id;
      return project;
    }
    console.log('project not found');
    return null;
  } catch (err) {
    console.error(err);
    throw new Error(`unable to get project ${projectName}`);
  }
};

// delete project if requestedEmail has authority (true for success)
const deleteProject = async (db, clubName, projectName, requestedEmail) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail) return false;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    const club = await db.collection('Clubs').findOne({ clubName });
    // check authorization
    if (project && (club.admins.includes(requestedEmail)
      || project.leaderEmail === requestedEmail)) {
      const result = await db.collection('Projects').deleteOne({ clubName, projectName });
      if (!result.acknowledged) {
        console.log('project deletion not acknowledged');
        return false;
      }
      return true;
    }
    console.log('user not authorized');
    return false;
  } catch (err) {
    console.error(err);
    throw new Error('unable to delete project');
  }
};

/**
 * Task Methods
 */

// returns id on success, null for failure
const createTask = async (
  db,
  clubName,
  projectName,
  taskName,
  requestedEmail,
  targetEmail,
  status,
) => {
  try {
    if (!db || !clubName || !projectName || !taskName
      || !requestedEmail || !targetEmail || !status) return null;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    if (!project.acknowledged) {
      return null;
    }
    if (project.leaderEmail === requestedEmail && project.members.includes(targetEmail)) {
      const taskValues = {
        _id: uuidv4(),
        taskName,
        assignedTo: targetEmail,
        status,
      };
      const projectResult = await db.collection('Projects').updateOne({ projectName }, { $push: { tasks: taskValues } });
      if (!projectResult.acknowledged) {
        return null;
      }
      return projectResult._id;
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to create tasks');
  }
};

// get all tasks from a project
const getAllTasks = async (
  db,
  clubName,
  projectName,
  requestedEmail,
) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail) return null;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    if (!project.acknowledged) {
      return null;
    }
    if (project.members.includes(requestedEmail)) {
      return project.tasks;
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get tasks');
  }
};

// get all tasks that are not done
const getOngoingTasks = async (
  db,
  clubName,
  projectName,
  requestedEmail,
) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail) return null;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    if (!project.acknowledged) {
      return null;
    }
    if (project.members.includes(requestedEmail)) {
      const { tasks } = project;
      return tasks.filter((task) => task.status !== 'Done');
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get tasks');
  }
};

// get one task object
const getTask = async (
  db,
  clubName,
  projectName,
  requestedEmail,
  taskID,
) => {
  try {
    if (!db || !clubName || !projectName || !requestedEmail) return null;
    const project = await db.collection('Projects').findOne({ clubName, projectName });
    if (!project.acknowledged) {
      return null;
    }
    if (project.members.includes(requestedEmail)) {
      const { tasks } = project;
      for (let i = 0; i < tasks.length; i += 1) {
        if (tasks[i]._id === taskID) {
          return tasks[i];
        }
      }
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('unable to get task');
  }
};

// update task status (true for success)
const updateTaskStatus = async (db, clubName, projectName, taskID, requestedEmail, newStatus) => {
  try {
    if (!db || !clubName || !projectName || !taskID || !requestedEmail || !newStatus) return false;
    const project = db.collection('Projects').findOne({ clubName, projectName });
    if (!project.acknowledged) {
      return false;
    }
    const { tasks } = project;
    let taskIndex;
    for (let i = 0; i < tasks.length; i += 1) {
      if (tasks[i]._id === taskID) {
        taskIndex = i;
      }
    }
    if (!taskIndex) return false;
    const task = tasks[taskIndex];
    if (requestedEmail !== task.assignedTo) {
      return false;
    }
    task.status = newStatus;
    const result = db.collection('Projects').updateOne({ clubName, projectName }, { $push: { tasks } });
    if (!result.acknowledged) return false;
    return true;
  } catch (err) {
    console.error(err);
    throw new Error('unable to update task status');
  }
};

module.exports = {
  connect,
  verifyLoginInfo,
  registerUser,
  getUserProfile,
  checkIfEmailAlreadyExists,
  getUserUniqueId,
  getUserClubs,
  createClub,
  getClub,
  getClubChat,
  sendMessage,
  joinClub,
  removeUserFromClub,
  createProject,
  assignUserToProject,
  removeUserFromProject,
  getProject,
  deleteProject,
  createTask,
  getAllTasks,
  getOngoingTasks,
  getTask,
  updateTaskStatus,
};
