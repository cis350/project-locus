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

const testClub = {
  db,
  clubName: 'Gym Rat',
  masterEmail: testUser.userEmail,
  masterName: 'Jeff Nippard',
  admins: [testUser.userEmail],
  projects: [],
  members: [testUser.userEmail],
  clubPassword: 'abc',
};

beforeAll(async () => {
  changeURL(testURL);
  webapp.listen();
  db = await dbLib.connect(testURL);
});

describe('users endpoint tests', () => {
  test('/ welcome message', async () => {
    await request(webapp).get('/').then((response) => expect(JSON.parse(response.text).message).toBe('Welcome to locus!'));
  });

  test('/login endpoint status code and response 400', async () => {
    await request(webapp).post('/login')
      .send({ email: 'test@gmail.com', password: 'testing123' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Login unsucessful for test@gmail.com'));
  });

  test('/register no fields 403', async () => {
    await request(webapp).post('/register').expect(403)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Forbidden POST'));
  });

  test('/register testUser 201/400 then login 200', async () => {
    const emailExists = await dbLib.checkIfEmailAlreadyExists(db, testUser.userEmail);
    if (emailExists) {
      await request(webapp).post('/register').send(testUser).expect(400)
        .then((response) => expect(JSON.parse(response.text).error).toBe('Email already exists'));
    } else {
      await request(webapp).post('/register').send(testUser).expect(201)
        .then((response) => expect(JSON.parse(response.text).message)
          .toBe(`${testUser.userFirstName} ${testUser.userLastName} added`));
    }
    await request(webapp).post('/login').send({ email: testUser.userEmail, password: testUser.userPassword }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message).toBe(`Login successful for ${testUser.userEmail}`));
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
});

describe('Club endpoint tests', () => {
  test('/clubs/:email endpoint 400', async () => {
    await request(webapp).get('/clubs/d@gmail.com').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('User not found'));
  });

  test('/clubs/:email endpoint 200', async () => {
    const userClubs = await dbLib.getUserClubs(db, testUser.userEmail);
    await request(webapp).get(`/clubs/${testUser.userEmail}`).expect(200)
      .then((response) => expect(JSON.parse(response.text).clubsArray).toMatchObject(userClubs));
  });

  test('/club/:clubName endpoint 400', async () => {
    await request(webapp).get('/club/noClub').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Club name does not exist'));
  });

  test('/club endpoint', async () => {
    const clubRes = await request(webapp).get(`/club/${testClub.clubName}`);
    const testId = await dbLib.getUserUniqueId(db, testUser.userEmail);
    if (clubRes.status === 400) {
      await request(webapp).post('/club')
        .send({ id: `${testId}`, clubName: testClub.clubName, clubPassword: testClub.clubPassword }).expect(200)
        .then((response) => expect(JSON.parse(response.text).message).toBe(`Club created with name ${testClub.clubName}`));
    } else {
      await request(webapp).post('/club')
        .send({ id: `${testId}`, clubName: testClub.clubName, clubPassword: testClub.clubPassword }).expect(400)
        .then((response) => expect(JSON.parse(response.text).error).toBe('Club name already exists'));
    }
  });

  test('/chats/:clubName endpoint 400', async () => {
    await request(webapp).get('/chats/nonexist').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('Club name does not exist'));
  });

  test('/chats/:clubname endpoint 200', async () => {
    await request(webapp).get(`/chats/${testClub.clubName}`).expect(200)
      .then((response) => expect(JSON.parse(response.text).clubObject).toMatchObject([]));
  });

  test('/joinclub/:clubName endpoint 400', async () => {
    await request(webapp).post('/joinclub/nonexist').expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
    await request(webapp).post('/joinclub/nonexist').send({ userEmail: 'jds' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
    await request(webapp).post('/joinclub/nonexist').send({ masterEmail: 'dfhg' }).expect(400)
      .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
  });

  test('/joinclub/:clubname endpoint 201', async () => {
    const user2Exists = await dbLib.checkIfEmailAlreadyExists(db, testUser2.userEmail);
    if (!user2Exists) {
      await request(webapp).post('/register').send(testUser2).expect(201)
        .then((response) => expect(JSON.parse(response.text).message).toBe(`${testUser2.userFirstName} ${testUser2.userLastName} added`));
    }
    const userClubs = await dbLib.getUserClubs(db, testUser2.userEmail);
    if (!userClubs.includes(testClub.clubName)) {
      await request(webapp).post('/joinclub/nonexist').send({ userEmail: testUser2.userEmail, masterEmail: testUser.userEmail }).expect(400)
        .then((response) => expect(JSON.parse(response.text).error).toBe('clubname or password incorrect'));
    }
  });
});

describe('Chat endpoint tests', () => {

});

describe('Projects endpoint tests', () => {

});

describe('Tasks endpoint tests', () => {

});

describe('Analytics endpoints tests', () => {

});
