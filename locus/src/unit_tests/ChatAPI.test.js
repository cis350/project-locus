const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../src/modules/chatAPI');

let mock;

beforeAll(() => {
    mock = new MockAdapter(axios);
  });