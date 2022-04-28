const server = require('./server');
const { changeURL, webapp } = require('./server');
// mock express server for comparison
const superTest = require('supertest');
const request = require('supertest');

const dbLib = require('./dbOperations');

let db;

const dlib = require('./dbOperations')
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


beforeAll(async () => {
    changeURL(testURL);
    webapp.listen();
    db = await dbLib.connect(testURL);
});

describe('login & register endpoint tests', () => {
    test ('/ welcome message', async () => {
        await request(webapp).get('/').then((response) => expect(JSON.parse(response.text).message).toBe('Welcome to locus!'));
        return;
    });

    test('/login endpoint status code and response 400', async () => {
        await request(webapp).post('/login')
        .send({ email: 'test@gmail.com', password: 'testing123' }).expect(400)
        .then((response) => expect(JSON.parse(response.text).error).toBe('Login unsucessful'));
        return;
    });

    test ('/register no fields 403', async () => {
        await request(webapp).post('/register').expect(403)
        .then((response) => expect(JSON.parse(response.text).error).toBe('Forbidden POST'));
        return;
    });

    test('/register testUser then login 200', async () => {
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
        .then((response) => expect(JSON.parse(response.text).message).toBe('Login successful'));
        return;
    });
});


describe('Club endpoint tests', () => {

});

describe('Chat endpoint tests', () => {

});
