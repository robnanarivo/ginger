const connect = require('../../../database/createConnection');
const { createUser, getUser } = require('../../../database/user');
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

describe('getUser Database operation tests', () => {
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

  test('getUser success', async () => {
    db = await connect(profile.url1);
    const addedUser = await createUser(db, testuser);
    const user = await getUser(db, addedUser._id);
    expect(user.email).toBe(testuser.email);
    expect(user.userName).toBe(testuser.userName);
    expect(user.isActive).toBe(testuser.isActive);
  });

  test('getUser user not found', async () => {
    db = await connect(profile.url1);
    try {
      await getUser(db, '5e9f8f8f8f8f8f8f8f8f8f');
    } catch (err) {
      expect(err.message).toBe('user not found');
    }
  });

  test('getUser exception', async () => {
    try {
      await getUser('', testuser);
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
