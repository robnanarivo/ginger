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
    await database.collection('groups').deleteOne({ groupName: 'testgroup2' });
    await database.collection('users').deleteOne({ userName: 'testuser' });
    // await database.collection('groups').deleteOne({ name: 'testuser3' });
  } catch (err) {
    // console.log('error', err.message);
  }
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('getGroups Database operation tests', () => {
  // test data
  const tg = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  const tg2 = {
    groupName: 'testgroup2',
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

  test('getGroups success', async () => {
    db = await connect(profile.url1);
    const testGroup = { ...tg };
    const testGroup2 = { ...tg2 };
    const testuser = { ...tu };
    // add groups into database
    const u = await userOperations.createUser(db, testuser);
    Object.assign(testGroup, { creatorId: u._id.toString() });
    Object.assign(testGroup2, { creatorId: u._id.toString() });
    await groupOperations.createGroup(db, testGroup);
    await groupOperations.createGroup(db, testGroup2);
    const groups = await groupOperations.getGroups(db, { params: { topic: 'popular' }, userId: u._id.toString() });
    expect(groups.length).toBeGreaterThanOrEqual(2);
    const suggestGroups = await groupOperations.getGroups(db, { params: { topic: 'suggestions' }, userId: u._id.toString() });
    expect(suggestGroups).not.toBeNull();
    // console.log(groups);
  });

  test('getGroups exception', async () => {
    try {
      await groupOperations.getGroups('', { params: { topic: 'popular' }, userId: '' });
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});
