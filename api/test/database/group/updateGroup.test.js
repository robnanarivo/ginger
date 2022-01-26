const connect = require('../../../database/createConnection');
const groupOperations = require('../../../database/group');
const userOperations = require('../../../database/user');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    const result = await database.collection('groups').deleteOne({ groupName: 'testgroup' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      // console.log('info', 'Successfully deleted group');
    } else {
      // console.log('warning', 'group was not deleted');
    }
    await database.collection('users').deleteOne({ userName: 'testuser2' });
    await database.collection('users').deleteOne({ userName: 'testuser' });
    // await database.collection('groups').deleteOne({ name: 'testuser3' });
  } catch (err) {
    // console.log('error', err.message);
  }
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('updateGroup Database operation tests', () => {
  // test data
  const tg = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  const tu = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  const tu2 = {
    email: 'johnSnow2@noob.com',
    userName: 'testuser2',
    password: 'Password123',
  };

  test('updateGroup success', async () => {
    db = await connect(profile.url1);
    const testGroup = { ...tg };
    const testuser = { ...tu };
    const testuser2 = { ...tu2 };
    // add group into database
    const u = await userOperations.createUser(db, testuser);
    const u2 = await userOperations.createUser(db, testuser2);
    Object.assign(testGroup, { creatorId: u._id.toString() });
    await groupOperations.createGroup(db, testGroup);
    let g = await db.collection('groups').findOne({ groupName: 'testgroup' });
    await groupOperations.updateGroup(db, { body: { action: 'apply', userIds: [u2._id.toString()], adminIds: [] } }, g['_id']);
    await groupOperations.updateGroup(db, { body: { action: 'join', userIds: [u2._id.toString()], adminIds: [] } }, g['_id']);
    g = await db.collection('groups').findOne({ groupName: 'testgroup' });
    expect(g.users.length).toBe(2);
    g = await groupOperations.updateGroup(db, { body: { action: 'leave', userIds: [u2._id.toString()], adminIds: [] } }, g['_id']);
    expect(g.users.length).toBe(1);
    await db.collection('notifications').deleteMany({ recipient: u._id.toString() });
    await db.collection('notifications').deleteMany({ recipient: u2._id.toString() });
    // console.log(g);
  });

  // test('updateGroup group not found', async () => {
  //   db = await connect(profile.url1);
  //   const testGroup = { ...tg };
  //   await groupOperations.createGroup(db, testGroup);
  //   const g = await db.collection('groups').findOne({ groupName: 'testgroup' });
  //   try {
  //     await groupOperations.updateGroup(db, 'aaaaaaaaaaaaaaaaaaaaaaaa', g);
  //   } catch (err) {
  //     expect(err.message).toBe('group not found');
  //   }
  // });

  // test('updateGroup exception', async () => {
  //   try {
  //     await groupOperations.updateGroup('', '', '');
  //   } catch (err) {
  //     expect(err.message).toBe('Error executing the query');
  //   }
  // });
});
