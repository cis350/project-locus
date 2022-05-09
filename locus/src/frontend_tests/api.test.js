const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../modules/api');

let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

const domain = 'https://locus-backend-350.herokuapp.com';
// const domain = 'http://localhost:3306';

test('registerUser return value', async () => {
  mock.onPost(`${domain}/register`).reply(201, { message: 'Jeffrey Yang added' });
  const response = await api.register('Jeffrey', 'Yang', 'email', 'pass', 'year', 'major');
  expect(response.jsonContent.message).toMatch('Jeffrey Yang added');
});

test('registerUser fails', async () => {
  mock.onPost(`${domain}/register`).reply(400, { error: 'failed' });
  const response = await api.register('Jeffrey', 'Yang', 'email', 'pass', 'year', 'major');
  expect(response.jsonContent.error).toMatch('failed');
});

test('login return value', async () => {
  mock.onPost(`${domain}/login`).reply(200, { message: 'Login successful' });
  const response = await api.login('JeffreyYang', 'pass');
  expect(response.jsonContent.message).toMatch('Login successful');
});

test('login fail', async () => {
  mock.onPost(`${domain}/login`).reply(400, { error: 'Failure' });
  const response = await api.login('JeffreyYang', 'pass');
  expect(response.jsonContent.error).toMatch('Failure');
});

test('getUserId return value', async () => {
  mock.onGet(`${domain}/id/jeff@gmail.com`).reply(200, { userId: 123 });
  const response = await api.getUserId('jeff@gmail.com');
  expect(response.jsonContent).toBe(123);
});

test('getUserId fail', async () => {
  mock.onGet(`${domain}/id/jeff@gmail.com`).reply(404, { error: 'Id not found' });
  const response = await api.getUserId('jeff@gmail.com');
  expect(response.jsonContent.error).toBe('Id not found');
});

test('getUser success', async () => {
  mock.onGet(`${domain}/user/jeff@gmail.com`).reply(200, { result: 'user' });
  const response = await api.getUser('jeff@gmail.com');
  expect(response).toBe('user');
});

test('getUser failure', async () => {
  mock.onGet(`${domain}/user/jeff@gmail.com`).reply(400, { error: 'internal error' });
  const response = await api.getUser('jeff@gmail.com');
  expect(response.jsonContent.error).toBe('internal error');
});

test('getAllProjects success', async () => {
  mock.onGet(`${domain}/projects/newclub`).reply(201, { message: 'success' });
  const response = await api.getAllProjects('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'success' });
});

test('getAllProjects failure', async () => {
  mock.onGet(`${domain}/projects/newclub`).reply(400, { message: 'failure' });
  const response = await api.getAllProjects('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('getProjects success', async () => {
  mock.onPost(`${domain}/project/newproject`).reply(200, { message: 'success' });
  const response = await api.getProject('newclub', 'newproject');
  expect(response.jsonContent).toMatchObject({ message: 'success' });
});

test('getProjects failure', async () => {
  mock.onPost(`${domain}/project/newproject`).reply(400, { message: 'failure' });
  const response = await api.getProject('newclub', 'newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('createProjects success', async () => {
  mock.onPut(`${domain}/project/newclub`).reply(201, { message: 'success' });
  const response = await api.createProject('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'success' });
});

test('createProjects failure', async () => {
  mock.onPut(`${domain}/project/newclub`).reply(400, { message: 'failure' });
  const response = await api.createProject('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('addUserToProject success', async () => {
  mock.onPost(`${domain}/assignUsertoProject/newproject`).reply(200, { message: 'success' });
  const response = await api.addUserToProject('newclub', 'email1', 'email2', 'newproject');
  expect(response.jsonContent).toMatchObject({ message: 'success' });
});

test('addUserToProject failure', async () => {
  mock.onPost(`${domain}/assignUsertoProject/newproject`).reply(400, { message: 'failure' });
  const response = await api.addUserToProject('newclub', 'email1', 'email2', 'newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('createClub success', async () => {
  mock.onPost(`${domain}/club`).reply(200, { message: 'club created successfully' });
  const response = await api.createClub('newclub', 'id', 'password');
  expect(response.jsonContent).toMatchObject({ message: 'club created successfully' });
});

test('createClub failure', async () => {
  mock.onPost(`${domain}/club`).reply(400, { message: 'club created failed' });
  const response = await api.createClub('newclub', 'id', 'password');
  expect(response.jsonContent).toMatchObject({ message: 'club created failed' });
});

test('getUserClubs success', async () => {
  mock.onGet(`${domain}/clubs/jeff@gmail.com`).reply(200, { clubsArray: ['zzz'] });
  const response = await api.getUserClubs('jeff@gmail.com');
  expect(response.jsonContent).toMatchObject(['zzz']);
});

test('getUserClubs failure', async () => {
  mock.onGet(`${domain}/clubs/jeff@gmail.com`).reply(400, { message: 'failed' });
  const response = await api.getUserClubs('jeff@gmail.com');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('getClubChat success', async () => {
  mock.onGet(`${domain}/chats/newclub`).reply(200, { clubObject: ['zzz'] });
  const response = await api.getClubChat('newclub');
  expect(response.jsonContent).toMatchObject(['zzz']);
});

test('getUserClubs failure', async () => {
  mock.onGet(`${domain}/chats/newclub`).reply(400, { message: 'failed' });
  const response = await api.getClubChat('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('getSendMessage success', async () => {
  mock.onPost(`${domain}/chats/newclub`).reply(200, { message: 'success' });
  const response = await api.sendMessage('newclub');
  expect(response.jsonContent).toBe('success');
});

test('getSendMessage failure', async () => {
  mock.onPost(`${domain}/chats/newclub`).reply(400, { message: 'failed' });
  const response = await api.sendMessage('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('getSpecificClub success', async () => {
  mock.onGet(`${domain}/club/newclub`).reply(200, { result: 'success' });
  const response = await api.getSpecificClub('newclub');
  expect(response.jsonContent).toBe('success');
});

test('getSpecificClub failure', async () => {
  mock.onGet(`${domain}/club/newclub`).reply(400, { message: 'failed' });
  const response = await api.getSpecificClub('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('joinClub success', async () => {
  mock.onPost(`${domain}/joinclub/newclub`).reply(200, { result: 'success' });
  const response = await api.joinClub('newclub');
  expect(response.jsonContent).toBe('success');
});

test('joinClub failure', async () => {
  mock.onPost(`${domain}/joinclub/newclub`).reply(400, { message: 'failed' });
  const response = await api.joinClub('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('deleteMemberFromClub success', async () => {
  mock.onDelete(`${domain}/removeMember/newclub`).reply(200, { result: 'success' });
  const response = await api.removeMember('newclub');
  expect(response.jsonContent).toBe('success');
});

test('deleteMemberFromClub failure', async () => {
  mock.onDelete(`${domain}/removeMember/newclub`).reply(400, { message: 'failed' });
  const response = await api.removeMember('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('deleteMemberFromProj success', async () => {
  mock.onDelete(`${domain}/removeUserFromProject/newproject`).reply(200, { result: 'success' });
  const response = await api.removeMemberFromProject('newproject');
  expect(response.jsonContent).toBe('success');
});

test('deleteMemberFromProj failure', async () => {
  mock.onDelete(`${domain}/removeUserFromProject/newproject`).reply(400, { message: 'failed' });
  const response = await api.removeMemberFromProject('newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('promoteMember success', async () => {
  mock.onPut(`${domain}/promotemember/newclub`).reply(200, { result: 'success' });
  const response = await api.promoteMember('newclub');
  expect(response.jsonContent).toBe('success');
});

test('promoteMember failure', async () => {
  mock.onPut(`${domain}/promotemember/newclub`).reply(400, { message: 'failed' });
  const response = await api.promoteMember('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('getUserNotifs success', async () => {
  mock.onGet(`${domain}/notifications/jeff@gmail.com`).reply(200, { notifications: 'success' });
  const response = await api.getUserNotifications('jeff@gmail.com');
  expect(response.jsonContent).toBe('success');
});

test('getUserNotifs failure', async () => {
  mock.onGet(`${domain}/notifications/jeff@gmail.com`).reply(400, { message: 'failed' });
  const response = await api.getUserNotifications('jeff@gmail.com');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('updateNotifs success', async () => {
  mock.onPut(`${domain}/notifications/newclub`).reply(200, { message: 'success' });
  const response = await api.updateNotifications('jeff@gmail.com', 'newclub');
  expect(response.jsonContent).toBe('success');
});

test('updateNotifs failure', async () => {
  mock.onPut(`${domain}/notifications/newclub`).reply(400, { message: 'failed' });
  const response = await api.updateNotifications('jeff@gmail.com', 'newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failed' });
});

test('createTask success', async () => {
  mock.onPost(`${domain}/createTask/newproject`).reply(200, { message: 'success' });
  const response = await api.createTask('newproject');
  expect(response.jsonContent).toBe('success');
});

test('createTask failure', async () => {
  mock.onPost(`${domain}/createTask/newproject`).reply(400, { message: 'failure' });
  const response = await api.createTask('newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('getTasksForProj success', async () => {
  mock.onPost(`${domain}/tasks/newproject`).reply(200, { result: 'success' });
  const response = await api.getTasksForProject('newproject');
  expect(response.jsonContent).toBe('success');
});

test('getTasksForProj failure', async () => {
  mock.onPost(`${domain}/tasks/newproject`).reply(400, { message: 'failure' });
  const response = await api.getTasksForProject('newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('update status for task success', async () => {
  mock.onPut(`${domain}/updateTaskStatus/123`).reply(200, { message: 'success' });
  const response = await api.updateStatusForCurrTask('123');
  expect(response.jsonContent).toBe('success');
});

test('update status for task failure', async () => {
  mock.onPut(`${domain}/updateTaskStatus/123`).reply(400, { message: 'failure' });
  const response = await api.updateStatusForCurrTask('123');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('reset password success', async () => {
  mock.onPut(`${domain}/resetPassword/jeff@gmail.com`).reply(200, { message: 'success' });
  const response = await api.resetPassword('jeff@gmail.com');
  expect(response.jsonContent).toBe('success');
});

test('reset password failure', async () => {
  mock.onPut(`${domain}/resetPassword/jeff@gmail.com`).reply(400, { message: 'failure' });
  const response = await api.resetPassword('jeff@gmail.com');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('delete task success', async () => {
  mock.onDelete(`${domain}/deleteTask/123`).reply(200, { message: 'success' });
  const response = await api.deleteTask('123');
  expect(response.jsonContent).toBe('success');
});

test('delete task failure', async () => {
  mock.onDelete(`${domain}/deleteTask/123`).reply(400, { message: 'failure' });
  const response = await api.deleteTask('123');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('get all tasks success', async () => {
  mock.onPost(`${domain}/tasks/newproject`).reply(200, { result: 'success' });
  const response = await api.getAllTasks('newproject');
  expect(response.jsonContent).toBe('success');
});

test('get all tasks failure', async () => {
  mock.onPost(`${domain}/tasks/newproject`).reply(400, { message: 'failure' });
  const response = await api.getAllTasks('newproject');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});

test('get all club tasks success', async () => {
  mock.onGet(`${domain}/AllOngoingTasks/newclub`).reply(200, { result: 'success' });
  const response = await api.getAllClubTasks('newclub');
  expect(response.jsonContent).toBe('success');
});

test('get all club tasks failure', async () => {
  mock.onGet(`${domain}/AllOngoingTasks/newclub`).reply(400, { message: 'failure' });
  const response = await api.getAllClubTasks('newclub');
  expect(response.jsonContent).toMatchObject({ message: 'failure' });
});
