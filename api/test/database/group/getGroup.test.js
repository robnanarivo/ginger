const connect = require('../../../database/createConnection');
const groupOperations = require('../../../database/group');
const userOperations = require('../../../database/user');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    await database.collection('groups').deleteOne({ groupName: 'testgroup' });
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

describe('getGroup Database operation tests', () => {
  // test data
  const tg = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '',
  };

  const tu = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };

  test('getGroup success', async () => {
    db = await connect(profile.url1);
    const testGroup = { ...tg };
    const testuser = { ...tu };
    // add groups into database
    const u = await userOperations.createUser(db, testuser);
    Object.assign(testGroup, { creatorId: u._id.toString() });
    const g = await groupOperations.createGroup(db, testGroup);
    const group = await groupOperations.getGroup(db, g.insertedId);
    expect(group.groupName).toEqual('testgroup');
  });

  test('getGroup exception', async () => {
    try {
      await groupOperations.getGroup('', '123');
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});
