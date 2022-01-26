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
    await db.collection('users').deleteOne({ userName: 'testuser2' });
    await db.collection('notifications').deleteMany({ content: 'testuser2 applied to join testgroup' });
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
  await clearDatabase();
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

  const testuser2 = {
    email: 'johnSnow2@noob.com',
    userName: 'testuser2',
    password: 'Password123',
  };

  const uGUserApply = {
    topics: ['popular'],
    groupIcon: '',
    action: 'apply',
    adminIds: [],
    userIds: ['234', '345'],
  };

  // const uGUserJoin = {
  //   topics: ['popular'],
  //   groupIcon: '',
  //   action: 'join',
  //   adminIds: [],
  //   userIds: ['234', '345'],
  // };

  // const uGAddAdmin = {
  //   topics: ['popular'],
  //   groupIcon: '',
  //   action: 'join',
  //   adminIds: ['1234'],
  //   userIds: [],
  // };

  // const uGRemoveAdmin = {
  //   topics: ['popular'],
  //   groupIcon: '',
  //   action: 'leave',
  //   adminIds: ['1234'],
  //   userIds: [],
  // };

  // const uGUserLeave = {
  //   topics: ['popular'],
  //   groupIcon: '',
  //   action: 'leave',
  //   adminIds: [],
  //   userIds: ['234'],
  // };

  test('update group: user applies to group', async () => {
    // create user
    await request(webapp).post('/api/users').send(testuser);
    await request(webapp).post('/api/users').send(testuser2);
    // user login
    const usr2 = await login(testuser2);
    const { userId, token } = await login(testuser);
    // prepare request
    const ugAP = { ...uGUserApply };
    Object.assign(testGroup, { creatorId: userId.toString() });
    Object.assign(ugAP, { userIds: [usr2.userId.toString()] });
    // create group
    const grp = await groupDBOperations.createGroup(db, testGroup);
    // update group information
    await request(webapp)
      .put(`/api/group/${grp.insertedId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ groupId: grp.insertedId, ...ugAP })
      .expect(200)
      .then((response) => {
        const resp = JSON.parse(response.text);
        expect(resp.results).toEqual('success');
      });
    // remove all notifications related to users
    await db.collection('notifications').deleteMany({ recipient: userId.toString() });
    await db.collection('notifications').deleteMany({ recipient: usr2.userId.toString() });
  });

  test('Integration test: The new group in the database is updated', async () => {
    // creat two users
    await request(webapp).post('/api/users').send(testuser);
    await request(webapp).post('/api/users').send(testuser2);
    // login
    const usr2 = await login(testuser2);
    const { userId, token } = await login(testuser);
    // prepare request information
    const ugAP = { ...uGUserApply };
    Object.assign(testGroup, { creatorId: userId.toString() });
    Object.assign(ugAP, { userIds: [usr2.userId.toString()] });
    // add group
    const grp = await groupDBOperations.createGroup(db, testGroup);
    // add admin
    await request(webapp)
      .put(`/api/group/${grp.insertedId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ groupId: grp.insertedId, ...ugAP })
      .expect(200)
      .then(async () => {
        const mg = await db.collection('groups').findOne({ groupName: 'testgroup' });
        expect(mg.users).toContain(userId.toString());
        expect(mg.applicantIds).toContain(usr2.userId.toString());
        expect(mg.admins).toContain(userId.toString());
      });
    // remove notifications related to users
    await db.collection('notifications').deleteMany({ recipient: userId.toString() });
    await db.collection('notifications').deleteMany({ recipient: usr2.userId.toString() });
  });
});
