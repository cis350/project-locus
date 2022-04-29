const api = require('../src/modules/profileAPI');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

const user = {
  id: 1, name: 'Dustin Fang', year: 2024, major: 'Computer Science', email: 'fdustin@seas.upenn.edu',
};

test('getUser success', async () => {
  mock.onGet('/profile').reply(200, { player: user });
  const response = await api.getUser({ id: '1' });
  expect(response.player).toMatchObject(user);
});

test('getUser failure', async () => {
  mock.onGet('/profile').reply(404, { player: user });
  const response = await api.getUser({ id: 'xxxxx' });
  expect(response.player).toMatchObject('Not Found');
});
