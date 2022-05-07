const axios = require('axios');

const domain = 'http://localhost:3306';

/*
 * Login and Registraition fetches
 */
async function register(firstName, lastName, email, password, year, major) {
  try {
    const result = await axios.post(`${domain}/register`, {
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      userPassword: password,
      userYear: year,
      userMajor: major,
    });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function login(userEmail, userPassword) {
  try {
    const result = await axios.post(`${domain}/login`, { email: userEmail, password: userPassword });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getUserId(userEmail) {
  try {
    const result = await axios.get(`${domain}/id/${userEmail}`);
    return { status: result.status, jsonContent: result.data.userId };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getUser(email) {
  try {
    const response = await axios.get(`${domain}/user/${email}`);
    return response.data.result;
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getAllProjects(clubname) {
  try {
    const response = await axios.get(`${domain}/projects/${clubname}`);
    return { status: response.status, jsonContent: response.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getProject(clubName, projectName) {
  try {
    const response = await axios.post(`${domain}/project/${projectName}`, { clubName });
    return { status: response.status, jsonContent: response.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function createProject(clubName, projectName, leaderEmail) {
  try {
    const response = await axios.put(`${domain}/project/${clubName}`, { projectName, leaderEmail });
    return { status: response.status, jsonContent: response.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function addUserToProject(clubName, requestedEmail, assigneeEmail, projectName) {
  try {
    const response = await axios.post(`${domain}/assignUsertoProject/${projectName}`, { clubName, requestedEmail, assigneeEmail });
    return { status: response.status, jsonContent: response.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

/*
 * Club fetches
 */
// create club with given name and master
async function createClub(clubName, id, clubPassword) {
  try {
    const response = await axios.post(`${domain}/club`, { clubName, id, clubPassword });
    return { status: response.status, jsonContent: response.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get all the clubs by userEmail and returns an array of [clubname, role]
async function getUserClubs(userEmail) {
  try {
    const result = await axios.get(`${domain}/clubs/${userEmail}`);
    return { status: result.status, jsonContent: result.data.clubsArray };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}
// get all chat for a club
async function getClubChat(clubName) {
  try {
    const result = await axios.get(`${domain}/chats/${clubName}`);
    return { status: result.status, jsonContent: result.data.clubObject };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// sends a message through the backend
async function sendMessage(clubName, email, message, content, time) {
  try {
    const result = await axios.post(
      `${domain}/chats/${clubName}`,
      {
        email,
        message,
        content,
        time,
      },
    );
    return { status: result.status, jsonContent: result.data.message };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

// get specific club given the name of the club
async function getSpecificClub(clubName) {
  try {
    const result = await axios.get(`${domain}/club/${clubName}`);
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function joinClub(clubName, userEmail, password) {
  try {
    const result = await axios.post(`${domain}/joinclub/${clubName}`, { userEmail, password });
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function removeMember(clubName, requestedEmail, targetEmail) {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${domain}/removeMember/${clubName}`,
      data: {
        requestedEmail,
        targetEmail,
      },
    });
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function removeMemberFromProject(projectName, clubName, requestedEmail, assigneeEmail) {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${domain}/removeUserFromProject/${projectName}`,
      data: {
        clubName,
        requestedEmail,
        assigneeEmail,
      },
    });
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function promoteMember(clubName, requesterEmail, targetEmail) {
  try {
    const result = await axios.put(`${domain}/promotemember/${clubName}`, { requestedEmail: requesterEmail, targetEmail });
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getAllClubTasks(clubName) {
  try {
    const result = await axios.get(`${domain}/AllOngoingTasks/${clubName}`);
    console.log(result.data.result);
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

module.exports = {
  register,
  login,
  getUserId,
  createClub,
  getSpecificClub,
  getUserClubs,
  getUser,
  joinClub,
  removeMember,
  promoteMember,
  getAllProjects,
  createProject,
  getProject,
  getClubChat,
  sendMessage,
  addUserToProject,
  removeMemberFromProject,
  getAllClubTasks,
};
