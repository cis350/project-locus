/* eslint-disable no-underscore-dangle */
// mock express server for comparison
const request = require('supertest');
const { changeURL, webapp } = require('./server');

const dbLib = require('./dbOperations');

let db;

// this url connects to the a dummy database in the cluster
const testURL = 'mongodb+srv://cis350:rv1wLHpUDR94Bmmk@locus.cyx90.mongodb.net/TestLocus?retryWrites=true&w=majority';
const testUser = {
  db,
  userFirstName: 'Jeff',
  userLastName: 'Nippard',
  userEmail: 'nippard@gmail.com',
  userPassword: 'abc123',
  userYear: '2024',
  userMajor: 'Gym',
};

const testUser2 = {
  db,
  userFirstName: 'Jeff',
  userLastName: 'Cavalier',
  userEmail: 'cavalier@gmail.com',
  userPassword: 'abc123',
  userYear: '2024',
  userMajor: 'Gym',
};

const testUser3 = {
  db,
  userFirstName: 'Ronnie',
  userLastName: 'Coleman',
  userEmail: 'coleman@gmail.com',
  userPassword: 'abc123',
  userYear: '2024',
  userMajor: 'Gym',
};

const lockoutUser = {
  db,
  userFirstName: 'Greg',
  userLastName: 'Coach',
  userEmail: 'Greg@gmail.com',
  userPassword: 'abc123',
  userYear: '2024',
  userMajor: 'Gym',
};

const testClub = {
  db,
  clubName: 'GymRats',
  masterEmail: testUser.userEmail,
  masterName: 'Jeff Nippard',
  admins: [testUser.userEmail],
  projects: [],
  members: [testUser.userEmail],
  password: 'abc',
};

beforeAll(async () => {
  changeURL(testURL);
  webapp.listen();
  db = await dbLib.connect(testURL);
  await db.collection('Users').remove({});
  await db.collection('Projects').remove({});
  await db.collection('Clubs').remove({});
  await db.collection('Chats').remove({});
});

describe('users endpoint tests', () => {
  test('/ welcome message', async () => {
    await request(webapp).get('/').then((response) => expect(JSON.parse(response.text).message).toBe('Welcome to locus!'));
  });

  test('/login endpoint status code and response 400', async () => {
    await request(webapp).post('/login')
      .send({ email: 'test@gmail.com', password: 'testing123' }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error).toBe('User not found'));
  });

  test('/login endpoint response 403 lockout lockoutUser', async () => {
    await request(webapp).post('/register')
      .send(lockoutUser).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`${lockoutUser.userFirstName} ${lockoutUser.userLastName} added`));
    await request(webapp).post('/login')
      .send({ email: lockoutUser.userEmail, password: 'wrong' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe(`Incorrect password for ${lockoutUser.userEmail}`));
    await request(webapp).post('/login')
      .send({ email: lockoutUser.userEmail, password: 'wrong' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe(`Incorrect password for ${lockoutUser.userEmail}`));
    await request(webapp).post('/login')
      .send({ email: lockoutUser.userEmail, password: 'wrong' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe(`Incorrect password for ${lockoutUser.userEmail}`));
    await request(webapp).post('/login')
      .send({ email: lockoutUser.userEmail, password: 'wrong' }).expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe(`Account for ${lockoutUser.userEmail} locked`));
    await request(webapp).post('/login')
      .send({ email: lockoutUser.userEmail, password: lockoutUser.userPassword }).expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe(`Account for ${lockoutUser.userEmail} locked`));
  });

  test('/register no fields 403', async () => {
    await request(webapp).post('/register').expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Forbidden POST'));
  });

  test('/register testUser 201/400 then login 200', async () => {
    await request(webapp).post('/register').send(testUser).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser.userFirstName} ${testUser.userLastName} added`));
    await request(webapp).post('/login').send({ email: testUser.userEmail, password: testUser.userPassword }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Login successful for ${testUser.userEmail}`));
  });

  test('/register testUser 400', async () => {
    await request(webapp).post('/register').send(testUser).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Email already exists'));
  });

  test('/id/:useremail test response 400', async () => {
    await request(webapp).get('/id/test@gmail.com')
      .send({ useremail: 'test@gmail.com' }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Id not found'));
  });

  test('/id/:useremail test response 200', async () => {
    await request(webapp).get(`/id/${testUser.userEmail}`)
      .send({ useremail: testUser.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe('Id found'));
  });

  test('/user/:email endpoint 400', async () => {
    await request(webapp).get('/user/d@gmail.com').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Bad request'));
  });

  test('/user/:email endpoint 200', async () => {
    const profile = {
      firstName: 'Jeff',
      lastName: 'Nippard',
      email: 'nippard@gmail.com',
      year: '2024',
      major: 'Gym',
      clubs: dbLib.getUserClubs(db, testUser.userEmail),
    };
    await request(webapp).get(`/user/${testUser.userEmail}`).expect(200)
      .then((response) => expect(JSON.parse(response.text).result).toMatchObject(profile));
  });

  test('/resetPassword/:useremail testUser 404', async () => {
    await request(webapp).put('/resetPassword/test@gmail.com')
      .send({ password: 0, useremail: 's' }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Failed to reset password'));
  });

  test('/resetPassword/:useremail testUser 201', async () => {
    await request(webapp).put(`/resetPassword/${testUser.userEmail}`)
      .send({ password: 'abc123', useremail: testUser.userEmail }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Password reset for ${testUser.userEmail}`));
  });

  test('/resetPassword/:useremail lockoutUser 201 unlocked', async () => {
    await request(webapp).put(`/resetPassword/${lockoutUser.userEmail}`)
      .send({ password: 'abc123', useremail: lockoutUser.userEmail }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Password reset for ${lockoutUser.userEmail}`));
    await request(webapp).post('/login').send({ email: lockoutUser.userEmail, password: lockoutUser.userPassword }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Login successful for ${lockoutUser.userEmail}`));
  });
});

// Club endpoints
describe('Club endpoint tests', () => {
  test('/clubs/:email endpoint 400', async () => {
    await request(webapp).get('/clubs/d@gmail.com')
      .send({ email: 'nonexistant' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('User not found'));
  });

  test('/clubs/:email endpoint 200', async () => {
    const userClubs = await dbLib.getUserClubs(db, testUser.userEmail);
    await request(webapp).get(`/clubs/${testUser.userEmail}`)
      .send({ email: testUser.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).clubsArray).toMatchObject(userClubs));
  });

  test('/club endpoint 200', async () => {
    const testId = await dbLib.getUserUniqueId(db, testUser.userEmail);
    await request(webapp).post('/club')
      .send({ id: `${testId}`, clubName: testClub.clubName, clubPassword: testClub.password }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Club created with name ${testClub.clubName}`));
  });

  test('/club endpoint 400', async () => {
    const testId = await dbLib.getUserUniqueId(db, testUser.userEmail);
    await request(webapp).post('/club')
      .send({ id: `${testId}`, clubName: testClub.clubName, clubPassword: testClub.password }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Club name already exists'));
  });

  test('/club/:clubName endpoint 400', async () => {
    await request(webapp).get('/club/nonexistant')
      .send({ clubName: 'nonexistant' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Club name does not exist'));
  });

  test('/club/:clubName endpoint 200', async () => {
    const club = dbLib.getClub(db, testClub.clubName);
    await request(webapp).get(`/club/${testClub.clubName}`)
      .send({ clubName: testClub.clubName }).expect(200)
      .then((response) => expect(JSON.parse(response.text).result).toMatchObject(club));
  });

  test('/joinclub/:clubName endpoint 400', async () => {
    await request(webapp).post('/joinclub/nonexist').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
    await request(webapp).post('/joinclub/nonexist').send({ userEmail: 'jds' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
    await request(webapp).post('/joinclub/nonexist').send({ password: 'dfhg' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
  });

  test('/joinclub/:clubName endpoint 400 wrong pass', async () => {
    await request(webapp).post('/register').send(testUser2).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`${testUser2.userFirstName} ${testUser2.userLastName} added`));
    await request(webapp).post(`/joinclub/${testClub.clubName}`)
      .send({
        clubName: testUser.clubName,
        userEmail: testUser2.userEmail,
        password: 'wrong password',
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
  });

  test('/joinclub/:clubname endpoint 201', async () => {
    await request(webapp).post(`/joinclub/${testClub.clubName}`).send({
      userEmail: testUser2.userEmail,
      password: testClub.password,
      clubname: testClub.clubName,
    }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`added ${testUser2.userEmail} to ${testClub.clubName}`));
  });

  test('/removeMember/:clubname 400', async () => {
    await request(webapp).delete('/removeMember/nonexistant')
      .send({
        requestedEmail: 'nonexistant',
        targetEmail: 'nonexistant2',
        clubname: testClub.clubName,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/removeMember/:clubname 403', async () => {
    await request(webapp).delete('/removeMember/nonexistant')
      .send({
        requestedEmail: 'nonexistant',
        targetEmail: 'nonexistant',
        clubname: testClub.clubName,
      }).expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Cannot remove self'));
  });

  test('/removeMember/:clubname 400 no privilege', async () => {
    await request(webapp).delete(`/removeMember/${testClub.clubName}`)
      .send({
        requestedEmail: testUser2.userEmail,
        targetEmail: testUser.userEmail,
        clubname: testClub.clubName,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  // test('/removeMember/:clubname 200', async () => {
  //   await request(webapp).delete(`/removeMember/${testClub.clubName}`)
  //     .send({
  //       requestedEmail: testUser.userEmail,
  //       targetEmail: testUser2.userEmail,
  //       clubname: testClub.clubName,
  //     }).expect(200)
  //     .then((response) => expect(JSON.parse(response.text).message)
  //       .toBe(`${testUser2.userEmail} removed from ${testClub.clubName}`));
  // });

  test('/promotemember/:clubname 403', async () => {
    await request(webapp).put(`/promotemember/${testClub.clubName}`)
      .send({
        requestedEmail: testUser.userEmail,
        targetEmail: testUser.userEmail,
        clubname: testClub.clubName,
      }).expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Cannot promote self'));
  });

  test('/promotemember/:clubname 403 no privilege', async () => {
    // await request(webapp).post('/register').send(testUser2).expect(201)
    //   .then((response) => expect(JSON.parse(response.text).message)
    //     .toBe(`${testUser2.userFirstName} ${testUser2.userLastName} added`));
    await request(webapp).put(`/promotemember/${testClub.clubName}`)
      .send({
        requestedEmail: testUser2.userEmail,
        targetEmail: testUser.userEmail,
        clubname: testClub.clubName,
      }).expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/promotemember/:clubname 200', async () => {
    await request(webapp).put(`/promotemember/${testClub.clubName}`)
      .send({
        requestedEmail: testUser.userEmail,
        targetEmail: testUser2.userEmail,
        clubname: testClub.clubName,
      }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`${testUser2.userEmail} promoted in ${testClub.clubName}`));
  });
});

describe('Chat endpoint tests', () => {
  test('/chats/:clubName get 400', async () => {
    await request(webapp).get('/chats/nonexist')
      .send({ clubname: 'nonexistant' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Club name does not exist'));
  });

  test('/chats/:clubName get 200', async () => {
    await request(webapp).get(`/chats/${testClub.clubName}`).expect(200)
      .then((response) => expect(JSON.parse(response.text).clubObject).toMatchObject([]));
  });

  test('/chats/:clubName post 400 nonexistant club', async () => {
    await request(webapp).post('/chats/nonexistant')
      .send({
        clubName: 'nonexistant', email: 't', message: 'e', content: 'e', time: 0,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/chats/:clubName post 400 sender not in club', async () => {
    await request(webapp).post(`/chats/${testClub.clubName}`)
      .send({
        clubName: testClub.clubName, email: lockoutUser.userEmail, message: 'e', content: 'e', time: 0,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/chats/:clubName post 200', async () => {
    await request(webapp).post(`/chats/${testClub.clubName}`)
      .send({
        clubName: testClub.clubName, email: testUser.userEmail, message: 'first', content: '', time: 1,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe('Message sent'));
  });

  test('/notifications/:userEmail 400', async () => {
    await request(webapp).get('/notifications/nonexistant')
      .send({ userEmail: 'nonexistant' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('User not found'));
  });

  test('/notifications/:userEmail 200', async () => {
    const notifs = await dbLib.getUnreadNotifications(db, testUser.userEmail);
    await request(webapp).get(`/notifications/${testUser.userEmail}`)
      .send({ userEmail: testUser.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).notifications).toMatchObject(notifs));
  });

  test('/notifications/:clubName 403', async () => {
    await request(webapp).put('/notifications/nonexistant').expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/notifications/:clubName 200', async () => {
    await request(webapp).put(`/notifications/${testClub.clubName}`)
      .send({ requestedEmail: testUser.userEmail, clubName: testClub.clubName }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Notifications for ${testUser.userEmail} updated for in ${testClub.clubName}`));
  });
});

describe('Projects endpoint tests', () => {
  test('/project/:clubname 400', async () => {
    await request(webapp).put('/project/nonexistant').expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/project/:clubname 400 request not admin', async () => {
    await request(webapp).post('/register').send(testUser3).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser3.userFirstName} ${testUser3.userLastName} added`));
    await request(webapp).post(`/joinclub/${testClub.clubName}`).send({
      userEmail: testUser3.userEmail,
      password: testClub.password,
      clubname: testClub.clubName,
    }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`added ${testUser3.userEmail} to ${testClub.clubName}`));
    await request(webapp).put(`/project/${testClub.clubName}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'proj',
        leaderEmail: testUser3.userEmail,
        requestedEmail: testUser3.userEmail,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/project/:clubname 201', async () => {
    await request(webapp).put(`/project/${testClub.clubName}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        leaderEmail: testUser2.userEmail,
        requestedEmail: testUser.userEmail,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Created TestProject for ${testClub.clubName}`));
  });

  test('/assignUsertoProject/:projectName 400', async () => {
    await request(webapp).post('/assignUsertoProject/nonexistant')
      .send({
        clubName: 'nonexistant',
        projectName: 'nonexistant',
        assigneeEmail: 'nonexistant',
        requestedEmail: 'nonexistant',
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/assignUsertoProject/:projectName 400 no privilege', async () => {
    await request(webapp).post('/assignUsertoProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser3.userEmail,
        assigneeEmail: testUser3.userEmail,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/assignUsertoProject/:projectName 201', async () => {
    await request(webapp).post('/assignUsertoProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser.userEmail,
        assigneeEmail: testUser3.userEmail,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser3.userEmail} added to TestProject`));
  });

  test('/removeUserFromProject/:projectName 400', async () => {
    await request(webapp).delete('/removeUserFromProject/nonexistant').expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/removeUserFromProject/:projectName 400 no privilege', async () => {
    await request(webapp).delete('/removeUserFromProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser3.userEmail,
        assigneeEmail: testUser.userEmail,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/removeUserFromProject/:projectName 200', async () => {
    await request(webapp).delete('/removeUserFromProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser.userEmail,
        assigneeEmail: testUser3.userEmail,
      }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser3.userEmail} removed from TestProject`));
  });

  test('/project/:projectName 404', async () => {
    await request(webapp).post('/project/nonexistant')
      .send({ clubName: testClub.clubName }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Project not found'));
  });

  test('/project/:projectName 200', async () => {
    const project = await dbLib.getProject(db, testClub.clubName, 'TestProject');
    await request(webapp).post('/project/TestProject')
      .send({ clubName: testClub.clubName }).expect(200)
      .then((response) => expect(JSON.parse(response.text).result)
        .toMatchObject(project));
  });

  test('/deleteProject/:projectName 400', async () => {
    await request(webapp).delete('/deleteProject/nonexistant')
      .send({ clubName: testClub.clubName, requestedEmail: testUser.userEmail }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/deleteProject/:projectName 400 no privilege', async () => {
    await request(webapp).post('/assignUsertoProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser.userEmail,
        assigneeEmail: testUser3.userEmail,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser3.userEmail} added to TestProject`));
    await request(webapp).delete('/deleteProject/TestProject')
      .send({ clubName: testClub.clubName, requestedEmail: testUser3.userEmail }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/deleteProject/:projectName 200', async () => {
    await request(webapp).delete('/deleteProject/TestProject')
      .send({ clubName: testClub.clubName, requestedEmail: testUser.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Removed TestProject from ${testClub.clubName}`));
  });
});

describe('Tasks endpoint tests', () => {
  test('/createTask/:projectName 400', async () => {
    await request(webapp).put(`/project/${testClub.clubName}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        leaderEmail: testUser2.userEmail,
        requestedEmail: testUser.userEmail,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Created TestProject for ${testClub.clubName}`));
    await request(webapp).post('/assignUsertoProject/TestProject')
      .send({
        clubName: testClub.clubName,
        requestedEmail: testUser.userEmail,
        assigneeEmail: testUser3.userEmail,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`${testUser3.userEmail} added to TestProject`));
    await request(webapp).post('/createTask/TestProject')
      .send({
        clubName: testClub.clubName,
        taskName: 'Task1',
        requestedEmail: testUser3.userEmail,
        targetEmail: testUser2.userEmail,
        status: 'Incomplete',
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/createTask/:projectName 201', async () => {
    await request(webapp).post('/createTask/TestProject')
      .send({
        clubName: testClub.clubName,
        taskName: 'Task1',
        requestedEmail: testUser2.userEmail,
        targetEmail: testUser3.userEmail,
        status: 'Incomplete',
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Created Task1 for TestProject assigned to ${testUser3.userEmail}`));
  });

  test('/reassignTask/:taskid 200', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    await request(webapp).put(`/reassignTask/${taskId}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        requestedEmail: testUser2.userEmail,
        targetEmail: testUser3.userEmail,
      }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Reassigned ${taskId} of TestProject to ${testUser3.userEmail}`));
  });

  test('/reassignTask/:taskid 404 bad id', async () => {
    await request(webapp).put('/reassignTask/23525666632')
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        requestedEmail: testUser2.userEmail,
        targetEmail: testUser3.userEmail,
      }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Task with id:23525666632 not found'));
  });

  test('/reassignTask/:taskid 400 no privilege', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    await request(webapp).put(`/reassignTask/${taskId}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        requestedEmail: testUser3.userEmail,
        targetEmail: testUser2.userEmail,
      }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/tasks/:projectName 400', async () => {
    await request(webapp).post('/tasks/TestProject').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/tasks/:projectName 200', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    await request(webapp).post('/tasks/TestProject')
      .send({ clubName: testClub.clubName, requestedEmail: testUser2 }).expect(200)
      .then((response) => expect(JSON.parse(response.text).result)
        .toMatchObject(project.tasks));
  });

  test('/ongoingProjectTasks/:projectName 400', async () => {
    await request(webapp).post('/ongoingProjectTasks/TestProject').expect(400)
      .then((response) => expect(JSON.parse(response.text).error)
        .toBe('Invalid request'));
  });

  test('/ongoingProjectTasks/:projectName 200', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    await request(webapp).post('/ongoingProjectTasks/TestProject')
      .send({ clubName: testClub.clubName, requestedEmail: testUser2.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).result)
        .toMatchObject(project.tasks));
  });

  test('/allOngoingTasks/:clubName 200', async () => {
    await request(webapp).get(`/allOngoingTasks/${testClub.clubName}`).expect(200);
  });

  test('/task/project/:taskId 400', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    await request(webapp).post(`/task/project/${taskId}`).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/task/project/:taskId 200', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    const task = await dbLib.getTask(db, testClub.clubName, 'TestProject', testUser2.userEmail, taskId);
    await request(webapp).post(`/task/project/${taskId}`)
      .send({ clubName: testClub.clubName, projectName: 'TestProject', requestedEmail: testUser2.userEmail }).expect(200)
      .then((response) => expect(JSON.parse(response.text).result)
        .toMatchObject(task));
  });

  test('/updateTaskStatus/:taskId 400', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    await request(webapp).put(`/updateTaskStatus/${taskId}`).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Invalid request'));
  });

  test('/updateTaskStatus/:taskId 200', async () => {
    const project = await db.collection('Projects').findOne({ clubName: `${testClub.clubName}`, projectName: 'TestProject' });
    const taskId = project.tasks[0]._id.toString();
    await request(webapp).put(`/updateTaskStatus/${taskId}`)
      .send({
        clubName: testClub.clubName,
        projectName: 'TestProject',
        requestedEmail: testUser2.userEmail,
        newStatus: 'need help',
      }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toBe(`Updated ${taskId} to need help`));
  });
});
