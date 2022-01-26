const request = require('supertest');
const dbHelper = require('../../../database/db');
// Import database operations
const groupDBOperations = require('../../../database/group');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  try {
    await db.collection('groups').deleteOne({ groupName: 'testgroup' });
    await db.collection('groups').deleteOne({ groupName: 'testgroup2' });
    await db.collection('groups').deleteOne({ groupName: 'testgroup3' });
    await db.collection('users').deleteOne({ userName: 'testuser' });
  } catch (err) {
    // console.log('error', err.message);
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

describe('getGroup endpoint API & integration tests', () => {
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

  const testGroup2 = {
    groupName: 'testgroup2',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  const testGroup3 = {
    groupName: 'testgroup3',
    groupType: 'public',
    topics: ['jazz'],
    groupIcon: '',
    creatorId: '123',
  };

  test('successfully get groups', async () => {
    // create user
    await request(webapp).post('/api/users').send(testuser);

    // login
    const { userId, token } = await login(testuser);

    // prepare group
    Object.assign(testGroup, { creatorId: userId.toString() });
    Object.assign(testGroup2, { creatorId: userId.toString() });
    Object.assign(testGroup3, { creatorId: userId.toString() });

    // create groups
    await groupDBOperations.createGroup(db, testGroup);
    await groupDBOperations.createGroup(db, testGroup2);
    await groupDBOperations.createGroup(db, testGroup3);

    // get groups
    await request(webapp)
      .get('/api/groups/popular')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        const resp = JSON.parse(response.text);
        // console.log(resp);
        expect(resp[0].id).not.toBe(null);
        expect(resp.length).toBeGreaterThanOrEqual(2);
      });

    // get groups
    await request(webapp)
      .get('/api/groups/public')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        const resp = JSON.parse(response.text);
        // console.log(resp);
        expect(resp.length).toBeGreaterThanOrEqual(3);
      });
  });
});
