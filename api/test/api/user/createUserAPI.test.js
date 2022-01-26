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

describe('Create user endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  test('successfully create user, integration test', async () => {
    db = await dbHelper.getDb();
    const response = await request(webapp).post('/api/users').send(testuser);
    expect(response.statusCode).toBe(201);
    expect(response.body.userName).toBe(testuser.userName);
    expect(response.body.email).toBe(testuser.email);
    const userDB = await db.collection('users').findOne({ email: testuser.email });
    expect(userDB.userName).toBe(testuser.userName);
  });

  test('response invalid input', async () => {
    const response = await request(webapp).post('/api/users').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('invalid input');
  });

  test('user already exist', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const response = await request(webapp).post('/api/users').send(testuser);
    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('user already exists');
  });
});
