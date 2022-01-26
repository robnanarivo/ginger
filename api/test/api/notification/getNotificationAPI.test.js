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
    const response = await request(webapp).get('/api/notifications').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe('test content');
    expect(response.body[0].type).toBe('GENERAL');
  });
});
