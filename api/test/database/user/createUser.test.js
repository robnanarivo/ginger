const connect = require('../../../database/createConnection');
const { createUser } = require('../../../database/user');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    const result = await database.collection('users').deleteOne({ userName: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      // console.log('info', 'Successfully deleted user');
    } else {
      // console.log('warning', 'user was not deleted');
    }
  } catch (err) {
    // console.log('error', err.message);
  }
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('createUser Database operation tests', () => {
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

  test('createUser integrity test', async () => {
    db = await connect(profile.url1);
    await createUser(db, testuser);
    // find new user in the DB
    const insertedUser = await db.collection('users').findOne({ userName: 'testuser' });
    expect(insertedUser.userName).toEqual('testuser');
    expect(insertedUser.email).toEqual('johnSnow@noob.com');
    expect(insertedUser.password).toEqual('testpassword123');
    expect(insertedUser.profilePicture).toEqual('');
    expect(insertedUser.flags).toEqual([]);
    expect(insertedUser.hides).toEqual([]);
    expect(insertedUser.isActive).toEqual(true);
  });

  test('createUser add two users with same userName', async () => {
    db = await connect(profile.url1);
    await createUser(db, testuser);
    try {
      await createUser(db, testuser);
    } catch (err) {
      expect(err.message).toBe('user already exists');
    }
  });

  test('createUser exception', async () => {
    try {
      await createUser('', testuser);
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
