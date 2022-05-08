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
  clubName: 'Gym Rats',
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
        clubName: testClub.clubName, email: testUser.userEmail, message: 'first', content: '', time: 0,
      }).expect(201)
      .then((response) => expect(JSON.parse(response.text).message).toBe('Message sent'));
  });
});

// describe('Projects endpoint tests', () => {

// });

// describe('Tasks endpoint tests', () => {

// });

// describe('Analytics endpoints tests', () => {

// });
