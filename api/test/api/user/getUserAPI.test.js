const request = require('supertest');
const dbHelper = require('../../../database/db');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
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

describe('Get user endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  test('successfully get user, integration test', async () => {
    const { userId, token } = await login(testuser);
    const response = await request(webapp).get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.userName).toBe('testuser');
    expect(response.body.email).toBe('johnSnow@noob.com');
  });

  test('user not exist', async () => {
    const { token } = await login(testuser);
    const response = await request(webapp).get('/api/users/5e9f8f9b8f9b8f9b8f9b8f9b').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('user not found');
  });

  test('login unauthorized test', async () => {
    const { userId } = await login(testuser);
    const response = await request(webapp).get(`/api/users/${userId}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('unauthorized');
  });

  test('login forbidden test', async () => {
    const { userId } = await login(testuser);
    const response = await request(webapp).get(`/api/users/${userId}`).set('Authorization', 'Bearer 1NVAL1DT0K3N');
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('forbidden');
  });
});
