const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../modules/chatAPI');

let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

const dummyChatClubsNames = ['PVG', 'PennLabs', 'WUFC', 'WITG'];
const dummyChatMessageParams = [{
  clubName: 'PVG', userEmail: '16fangd@gmail.com', message: 'Hi', date: '04/02/2022', uid: '1',
}];
const dummyNewChatMessage = [{
  clubName: 'PVG', userEmail: '16fangd@gmail.com', message: 'Goodbye', date: '04/02/2022', uid: '2',
}];
const dummyUID = 1;
const dummyCID = 1;

test('getUserClubNames success', async () => {
  mock.onGet('/chat').reply(200, { clubs: dummyChatClubsNames });
  const response = await api.getUserClubnames({ userID: dummyUID });
  expect(response.clubs).toMatchObject(dummyChatClubsNames);
});

test('getUserClubNames failure', async () => {
  mock.onGet('/chat').reply(404, { clubs: dummyChatClubsNames });
  const response = await api.getUserClubnames({ userId: 'xxxxx' });
  expect(response.player).toMatchObject('Not Found');
});

test('getChat success', async () => {
  mock.onGet('/chat').reply(200, { uid: dummyChatMessageParams });
  const response = await api.getChat({ cid: dummyCID });
  // check the first chat contains correct stuff
  expect(response.chats[0].clubName).toMatchObject(dummyChatMessageParams.clubName);
  expect(response.chats[0].userEmail).toMatchObject(dummyChatMessageParams.userEmail);
  expect(response.chats[0].message).toMatchObject(dummyChatMessageParams.message);
});

test('getChat failure', async () => {
  mock.onGet('/chat').reply(200, { uid: dummyChatMessageParams });
  const response = await api.getChat({ cid: dummyCID });
  expect(response.msg).toMatchObject('Not Found');
});

test('sendChat success', async () => {
  mock.onGet('/chat').reply(200, {
    mid: dummyNewChatMessage.uid,
    message: dummyNewChatMessage.message,
    sid: dummyNewChatMessage.userEmail,
    cid: dummyNewChatMessage.clubName,
  });
  const response = await api.sendChat(
    {
      mid: dummyNewChatMessage.uid,
      message: dummyNewChatMessage.message,
      sid: dummyNewChatMessage.userEmail,
      cid: dummyNewChatMessage.clubName,
    },
  );
  expect(response.msg).toMatchObject('Success');
});

test('sendChat failure no permissions', async () => {
  mock.onGet('/chat').reply(403, {
    mid: dummyNewChatMessage.uid,
    message: dummyNewChatMessage.message,
    sid: dummyNewChatMessage.userEmail,
    cid: dummyNewChatMessage.clubName,
  });
  const response = await api.sendChat(
    {
      mid: dummyNewChatMessage.uid,
      message: dummyNewChatMessage.message,
      sid: dummyNewChatMessage.userEmail,
      cid: dummyNewChatMessage.clubName,
    },
  );
  expect(response.msg).toMatchObject('No permissions');
});

test('sendChat failure no permissions', async () => {
  mock.onGet('/chat').reply(404, {
    mid: dummyNewChatMessage.uid,
    message: dummyNewChatMessage.message,
    sid: dummyNewChatMessage.userEmail,
    cid: dummyNewChatMessage.clubName,
  });
  const response = await api.sendChat(
    {
      mid: dummyNewChatMessage.uid,
      message: dummyNewChatMessage.message,
      sid: dummyNewChatMessage.userEmail,
      cid: dummyNewChatMessage.clubName,
    },
  );
  expect(response.msg).toMatchObject('Not Found');
});
