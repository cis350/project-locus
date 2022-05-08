const axios = require('axios');

const domain = 'http://localhost:3306';

// returns a boolean based on whether or not he login was successful
async function login(email, password) {
  try {
    const response = await axios.post(`${domain}/login`, { email, password });
    if (response.status === 200) return 200;
    return 400;
  } catch (err) {
    return err.response.status;
  }
}

async function getUser(email) {
  try {
    const response = await axios.get(`${domain}/user/${email}`);
    return response.data;
  } catch (err) {
    return false;
  }
}

async function getUserId(email) {
  try {
    const response = await axios.get(`${domain}/id/${email}`);
    return response.data.userId;
  } catch (err) {
    return err.response.status;
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

async function promoteMember(clubName, requesterEmail, targetEmail) {
  try {
    const result = await axios.put(`${domain}/promotemember/${clubName}`, { requestedEmail: requesterEmail, targetEmail });
    return { status: result.status, jsonContent: result.data.result };
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

async function getClubProjects(clubName) {
  try {
    const result = await axios.get(`${domain}/projects/${clubName}`);
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function createClubProject(clubName, projectName, leaderEmail) {
  try {
    const result = await axios.put(`${domain}/project/${clubName}`, { projectName, leaderEmail });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function assignUserToProject(clubName, projectName, requestedEmail, assigneeEmail) {
  try {
    const result = await axios.post(`${domain}/assignUsertoProject/${projectName}`, { clubName, requestedEmail, assigneeEmail });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function removeUserFromProject(clubName, projectName, requestedEmail, assigneeEmail) {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${domain}/removeUserFromProject/${projectName}`,
      data: {
        clubName, requestedEmail, assigneeEmail,
      },
    });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getSpecificProject(clubName, projectName) {
  try {
    const result = await axios.post(`${domain}/project/${projectName}`, { clubName });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function deleteProject(clubName, projectName, requestedEmail) {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${domain}/deleteProject/${projectName}`,
      data: {
        clubName,
        requestedEmail,
      },
    });
    return { status: result.status, jsonContent: result.data.result };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function createTask(clubName, projectName, taskName, requestedEmail, targetEmail, status) {
  try {
    console.log(clubName);
    console.log(projectName);
    console.log(taskName);
    console.log(requestedEmail);
    console.log(targetEmail);
    console.log(status);
    const result = await axios.post(`${domain}/createTask/${projectName}`, {
      clubName, taskName, requestedEmail, targetEmail, status,
    });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    console.log(err.response.data);
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function getAllTasksForProject(clubName, projectName, requestedEmail) {
  try {
    console.log(clubName);
    console.log(projectName);
    console.log(requestedEmail);
    const result = await axios.post(`${domain}/tasks/${projectName}`, { clubName, requestedEmail });
    console.log(result);
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    console.log(err.response.data);
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

async function updateTaskStatus(clubName, projectName, requestedEmail, newStatus, taskId) {
  try {
    const result = await axios.post(`${domain}//updateTaskStatus//${taskId}`, {
      clubName, requestedEmail, projectName, newStatus,
    });
    return { status: result.status, jsonContent: result.data };
  } catch (err) {
    return { status: err.response.status, jsonContent: err.response.data };
  }
}

module.exports = {
  login,
  getUser,
  getUserId,
  createClub,
  getUserClubs,
  getSpecificClub,
  joinClub,
  removeMember,
  promoteMember,
  sendMessage,
  getClubChat,
  getClubProjects,
  createClubProject,
  assignUserToProject,
  removeUserFromProject,
  getSpecificProject,
  deleteProject,
  getAllTasksForProject,
  updateTaskStatus,
  createTask,
};
