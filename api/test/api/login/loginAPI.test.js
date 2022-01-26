const request = require('supertest');
const dbHelper = require('../../../database/db');
const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Login endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  test('successfully login', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const response = await request(webapp).post('/api/login').send(testuser);
    expect(response.statusCode).toBe(200);
    expect('token' in response.body).toBe(true);
    expect('userId' in response.body).toBe(true);
  });

  test('response email or password not correct', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const response = await request(webapp).post('/api/login').send({ email: 'hacker@hack.com', password: 'Password123' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('invalid email or password');
  });
});
