const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../modules/ProjectAPI');

let mock;
const root = 'localhost:3000';
const testProject = {
  name: 'testproject',
};

const testUser = {
  name: 'testuser',
};

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

describe('project tests', () => {
  test('getProject success', async () => {
    mock.onGet(`${root}/project`).reply(200, testProject);
    const response = await api.getProject(1, 2, 3);
    expect(response.data).toMatchObject(testProject);
  });
  test('getProject error', async () => {
    mock.onGet(`${root}/project`).networkError();
    const response = await api.getProject(1, 2, 3);
    expect(response.status).toBe(404);
    expect(response.statusText).toBe('Project Not Found');
  });
});

describe('add member tests', () => {
  test('add member success', async () => {
    mock.onPut(`${root}/projectmember`).reply(200, testProject);
    const response = await api.addProjMember(1, testUser);
    expect(response.data).toMatchObject(testProject);
  });
  test('add member error', async () => {
    mock.onPut(`${root}/project`).networkError();
    const response = await api.addProjMember(1, testUser);
    expect(response.status).toBe(404);
    expect(response.statusText).toBe('Project Not Found');
  });
});

describe('remove member tests', () => {
  test('remove member success', async () => {
    mock.onDelete(`${root}/projectmember`).reply(200, testProject);
    const response = await api.deleteProjMember(1, testUser);
    expect(response.data).toMatchObject(testProject);
  });
  test('add member error', async () => {
    mock.onPut(`${root}/project`).networkError();
    const response = await api.deleteProjMember(1, testUser);
    expect(response.status).toBe(404);
  });
});

describe('create task tests', () => {
  test('create task success', async () => {
    mock.onPut(`${root}/projectmember`).reply(200, testProject);
    const response = await api.addProjMember(1, testUser);
    expect(response.data).toMatchObject(testProject);
  });
  test('add member error', async () => {
    mock.onPut(`${root}/project`).networkError();
    const response = await api.addProjMember(1, testUser);
    expect(response.status).toBe(403);
  });
});

describe('update task tests', () => {
  test('update task success', async () => {
    mock.onPut(`${root}/projectmember`).reply(200, testProject);
    const response = await api.addProjMember(1, testUser);
    expect(response.data).toMatchObject(testProject);
  });
  test('add member error', async () => {
    mock.onPut(`${root}/project`).networkError();
    const response = await api.addProjMember(1, testUser);
    expect(response.status).toBe(403);
  });
});
