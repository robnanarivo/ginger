const connect = require('../../../database/createConnection');
const groupOperations = require('../../../database/group');
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
    // await database.collection('groups').deleteOne({ name: 'testuser3' });
  } catch (err) {
    // console.log('error', err.message);
  }
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */

afterEach(async () => {
  await clearDatabase(db);
});

describe('createGroup Database operation tests', () => {
  // test data
  const tg = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  const tgIV = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };

  test('createGroup create a new group success', async () => {
    db = await connect(profile.url1);
    const testGroup = { ...tg };
    await groupOperations.createGroup(db, testGroup);
    // find new user in the DB
    const insertedGroup = await db.collection('groups').findOne({ groupName: 'testgroup' });
    expect(insertedGroup.groupName).toEqual('testgroup');
    expect(insertedGroup.groupType).toEqual('public');
    expect(insertedGroup.topics[0]).toEqual('popular');
    expect(insertedGroup.groupIcon).toEqual('');
    expect(insertedGroup.creatorId).toEqual('123');
    expect(insertedGroup.users.length).toEqual(1);
    expect(insertedGroup.users[0]).toEqual('123');
    expect(insertedGroup.admins.length).toEqual(1);
    expect(insertedGroup.admins[0]).toEqual('123');
    expect(insertedGroup.applicantIds).toEqual([]);
    expect(insertedGroup.posts).toEqual([]);
    expect(insertedGroup.timeStamp).not.toBe(null);
    expect(insertedGroup.groupId).not.toBe(null);
  });

  test('createGroup add two groups with same groupName', async () => {
    db = await connect(profile.url1);
    let testGroup = { ...tg };
    await groupOperations.createGroup(db, testGroup);
    try {
      testGroup = { ...tg };
      await groupOperations.createGroup(db, testGroup);
    } catch (err) {
      expect(err.message).toBe('group with same name already exists');
    }
  });

  test('createGroup invalid input invalid groupName', async () => {
    db = await connect(profile.url1);
    const testGroupIV = { ...tgIV };
    testGroupIV.groupName = 5;
    try {
      await groupOperations.createGroup(db, testGroupIV);
    } catch (err) {
      expect(err.message).toBe('invalid input');
    }
  });

  test('createGroup invalid input invalid groupType', async () => {
    db = await connect(profile.url1);
    const testGroupIV = { ...tgIV };
    testGroupIV.groupType = 'unknown';
    try {
      await groupOperations.createGroup(db, testGroupIV);
    } catch (err) {
      expect(err.message).toBe('invalid input');
    }
  });

  test('createGroup invalid input at least one topic', async () => {
    db = await connect(profile.url1);
    const testGroupIV = { ...tgIV };
    testGroupIV.topics = [];
    try {
      await groupOperations.createGroup(db, testGroupIV);
    } catch (err) {
      expect(err.message).toBe('invalid input');
    }
  });

  test('createGroup exception', async () => {
    const testGroup = { ...tg };
    try {
      await groupOperations.createGroup('', testGroup);
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});
