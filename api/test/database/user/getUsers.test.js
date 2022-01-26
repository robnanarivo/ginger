const connect = require('../../../database/createConnection');
const { getUsers } = require('../../../database/user');
const profile = require('../../../constants/profile');

let db;

describe('getUsers Database operation tests', () => {
  test('getUsers success', async () => {
    db = await connect(profile.url1);
    const users = await getUsers(db);
    expect(Array.isArray(users)).toBe(true);
  });

  test('getUsers exception', async () => {
    try {
      await getUsers('');
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
