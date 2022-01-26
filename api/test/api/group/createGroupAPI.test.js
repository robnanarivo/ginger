const request = require('supertest');
const dbHelper = require('../../../database/db');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  try {
    await db.collection('groups').deleteOne({ groupName: 'testgroup' });
    await db.collection('users').deleteOne({ userName: 'testuser' });
  } catch (err) {
    // console.log(err)
  }
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

describe('Create group endpoint API & integration tests', () => {
  const testGroup = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  const testGroupMiss = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
  };

  test('successfully create group', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { token } = await login(testuser);

    await request(webapp)
      .post('/api/group/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testGroup })
      .expect(200)
      .then((response) => {
        const resp = JSON.parse(response.text);
        expect(resp.id).not.toEqual(null);
        expect(resp.groupName).toEqual(testGroup.groupName);
        expect(resp.groupType).toEqual(testGroup.groupType);
        expect(resp.groupIcon).toEqual(testGroup.groupIcon);
      });
  });

  test('status code and response invalid input', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { token } = await login(testuser);

    request(webapp)
      .post('/api/group/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testGroupMiss })
      .expect(400) // testing the response status code
      .then((response) => {
        expect(JSON.parse(response.text).error).toBe('invalid input');
      });
  });
  // expected response without the id

  test('group already exist', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { token } = await login(testuser);

    await request(webapp)
      .post('/api/group/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testGroup })
      .expect(200);
    await request(webapp)
      .post('/api/group/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testGroup })
      .expect(409)
      .then((response) => {
        expect(JSON.parse(response.text).error).toBe('group with same name already exists');
      });
  });

  test('The new group is in the database', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { token } = await login(testuser);

    await request(webapp)
      .post('/api/group/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testGroup })
      .expect(200)
      .then(async () => {
        const insertedGroup = await db.collection('groups').findOne({ groupName: 'testgroup' });
        expect(insertedGroup.creatorId).toEqual(testGroup.creatorId);
      });
  });
});
