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
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Get users endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  test('successfully get users', async () => {
    const { token } = await login(testuser);
    const res = await request(webapp).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
