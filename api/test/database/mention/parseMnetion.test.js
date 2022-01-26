const { parseMention } = require('../../../shared/mention/mention');
const profile = require('../../../constants/profile');
const connect = require('../../../database/createConnection');

describe('createNotification Database operation tests', () => {
  test('createNotification integrity test', async () => {
    const db = await connect(profile.url1);
    const result = await parseMention(db, '@tester what is this?!');
    expect(Array.isArray(result)).toBe(true);
  });
});
