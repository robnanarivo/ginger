const request = require('supertest');
const dbHelper = require('../../../database/db');
// Import database operations
const groupDBOperations = require('../../../database/group');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  try {
    await db.collection('groups').deleteOne({ groupName: 'testgroup' });
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

  test('successfully get group', async () => {
    // create group
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    Object.assign(testGroup, { creatorId: userId.toString() });

    const grp = await groupDBOperations.createGroup(db, testGroup);
    // get group
    await request(webapp)
      .get(`/api/group/${grp.insertedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        const resp = JSON.parse(response.text);
        // console.log(resp);
        expect(resp.id).not.toBe(null);
        expect(resp.groupName).toEqual(testGroup.groupName);
        expect(resp.groupType).toEqual(testGroup.groupType);
        expect(resp.groupIcon).toEqual(testGroup.groupIcon);
      });
  });

  test('invalid input', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    Object.assign(testGroup, { creatorId: userId.toString() });

    await request(webapp)
      .get('/api/group/123')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then((response) => {
        expect(JSON.parse(response.text).error).toBe('invalid input');
      });
  });

  test('group not found', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    Object.assign(testGroup, { creatorId: userId.toString() });

    await request(webapp)
      .get('/api/group/aaaaaaaaaaaaaaaaaaaaaaaa')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((response) => {
        expect(JSON.parse(response.text).error).toBe('Error executing the query');
      });
  });
});
