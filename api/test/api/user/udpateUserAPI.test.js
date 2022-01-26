const request = require('supertest');
const dbHelper = require('../../../database/db');

const webapp = require('../../../app');

let db;

const login = async (user) => {
  await request(webapp).post('/api/users').send(user);
  const response = await request(webapp).post('/api/login').send(user);
  return response.body;
};

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
  await db.collection('users').deleteOne({ userName: 'testuser2' });
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Update user endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  const updatedUser = {
    userName: 'testuser2',
    password: 'PiassWord123',
  };

  test('successfully create user, integration test', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    const res = await request(webapp).put(`/api/users/${userId}`).send({ ...updatedUser }).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.userName).toBe(updatedUser.userName);
    const userDB = await db.collection('users').findOne({ email: testuser.email });
    expect(userDB.userName).toBe(updatedUser.userName);
  });

  test('response invalid input', async () => {
    const { userId, token } = await login(testuser);
    const response = await request(webapp).put(`/api/users/${userId}`).send({ email: 'yeet@seed.com' }).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('invalid input');
  });

  test('user not exist', async () => {
    const { token } = await login(testuser);
    const response = await request(webapp).put('/api/users/5e9f8f9b8f9b8f9b8f9b8f9b').send({ ...updatedUser }).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('user not found');
  });
});
