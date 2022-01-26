const request = require('supertest');
const dbHelper = require('../../../database/db');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('messages').deleteOne({ sender: 'testuser1' });
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('get message endpoint API & integration tests', () => {
  const testMessage = {
    sender: 'testuser1',
    recipient: 'testuser2',
    message: {},
    timeStamp: Date.now(),
  };

  test('successfully get message', async () => {
    db = await dbHelper.getDb();
    const response = await request(webapp).post('/api/messages').send(testMessage);
    expect(response.statusCode).toBe(201);
    expect(response.body.sender).toBe(testMessage.sender);
    expect(response.body.recipient).toBe(testMessage.recipient);
    const message = await request(webapp).get('/api/messages').query({
      chatter1: testMessage.sender,
      chatter2: testMessage.recipient,
      limit: 1,
      offset: 0,
    });
    expect(message.statusCode).toBe(200);
    expect(message.body.length).toBe(1);
    expect(message.body[0].sender).toBe(testMessage.sender);
    expect(message.body[0].recipient).toBe(testMessage.recipient);
  });
});
