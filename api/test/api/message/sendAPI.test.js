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

describe('send message endpoint API & integration tests', () => {
  const testMessage = {
    sender: 'testuser1',
    recipient: 'testuser2',
    message: {},
    timeStamp: Date.now(),
  };

  test('successfully send message, integration test', async () => {
    db = await dbHelper.getDb();
    const response = await request(webapp).post('/api/messages').send(testMessage);
    expect(response.statusCode).toBe(201);
    expect(response.body.sender).toBe(testMessage.sender);
    expect(response.body.recipient).toBe(testMessage.recipient);
    const messageDB = await db.collection('messages').findOne({ sender: testMessage.sender });
    expect(messageDB.sender).toBe(testMessage.sender);
    expect(messageDB.recipient).toBe(testMessage.recipient);
  });
});
