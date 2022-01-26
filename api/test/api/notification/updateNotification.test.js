const request = require('supertest');
const dbHelper = require('../../../database/db');
const { createNotification } = require('../../../database/notification');
const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
  await db.collection('notifications').deleteOne({ content: 'test content' });
};

const login = async (user) => {
  await request(webapp).post('/api/users').send(user);
  const response = await request(webapp).post('/api/login').send(user);
  return response.body;
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Get Notification endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };
  const testNoti = {
    params: {},
    recipient: 'recipientPlaceholder',
    type: 'GENERAL',
    content: 'test content',
    hasRead: false,
  };

  test('successfully get user, integration test', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    await createNotification(db, { ...testNoti, recipient: userId });
    const insertedNoti = await db.collection('notifications').findOne({ content: 'test content' });
    const response = await request(webapp).put(`/api/notifications/${insertedNoti._id}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.hasRead).toBe(true);
  });
});
