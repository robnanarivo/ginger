const connect = require('../../../database/createConnection');
const { createUser, updateUser } = require('../../../database/user');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    await database.collection('users').deleteOne({ userName: 'testuser' });
    await database.collection('users').deleteOne({ userName: 'testuser2' });
  } catch (err) {
    // console.log('error', err.message);
  }
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('updateUser Database operation tests', () => {
  // test data
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'testpassword123',
    profilePicture: '',
    flags: [],
    hides: [],
    isActive: true,
  };

  const testuser2 = {
    email: 'johnS@noob.com',
    userName: 'testuser2',
    password: 'testpasaaord123',
    profilePicture: '',
    flags: [],
    hides: [],
    isActive: false,
  };

  test('updateUser integrity test', async () => {
    db = await connect(profile.url1);
    const oriUser = await createUser(db, testuser);
    await updateUser(db, testuser2, oriUser._id);
    // find new user in the DB
    const insertedUser = await db.collection('users').findOne({ userName: 'testuser2' });
    expect(insertedUser.userName).toEqual('testuser2');
    expect(insertedUser.email).toEqual('johnS@noob.com');
    expect(insertedUser.password).toEqual('testpasaaord123');
    expect(insertedUser.profilePicture).toEqual('');
    expect(insertedUser.flags).toEqual([]);
    expect(insertedUser.hides).toEqual([]);
    expect(insertedUser.isActive).toEqual(false);
  });

  test('updateUser cannot find existing user', async () => {
    db = await connect(profile.url1);
    try {
      await updateUser(db, testuser);
    } catch (err) {
      expect(err.message).toBe('user not found');
    }
  });

  test('updateUser exception', async () => {
    try {
      await updateUser('', testuser);
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
