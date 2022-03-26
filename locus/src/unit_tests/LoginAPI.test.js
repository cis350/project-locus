const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../src/modules/loginAPI');

let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

const user = {
  id: 1, name: 'Dustin Fang', email: 'fdustin@seas.upenn.edu', password: 'hello',
};

// login
test('login getUser success', async () => {
  mock.onGet("/login").reply(200, { player: user });
  const response = await api.validate({ email: user.email, password: 'hello' });
  expect(response.player).toMatchObject(user);
});

test('login getUser success', async () => {
  mock.onGet("/login").reply(401, { player: user });
  const response = await api.validate({ email: user.email, password: 'bye' });
  expect(response.player).toMatchObject('Unauthorized');
});

// register
test('register createUser success', async () => {
  mock.onGet("/register").reply(200, { player: user });
  const response = await api.createUser({ email: user.email, name: user.name, password: 'hello' });
  expect(response.player).toMatchObject(user);
});

test('login createUser failure', async () => {
  mock.onGet("/register").reply(408, { player: null });
  const response = await api.createUser(null);
  expect(response.player).toMatchObject('Request Timeout');
});
