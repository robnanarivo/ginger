const connect = require('../../../database/createConnection');
const { createNotification } = require('../../../database/notification');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    const result = await database.collection('notifications').deleteOne({ content: 'test content' });
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

describe('createNotification Database operation tests', () => {
  const testNoti = {
    params: {},
    recipient: 'recipientPlaceholder',
    type: 'GENERAL',
    content: 'test content',
    hasRead: false,
  };

  test('createNotification integrity test', async () => {
    db = await connect(profile.url1);
    const responseNoti = await createNotification(db, testNoti);
    expect(responseNoti.content).toBe('test content');
    expect(responseNoti.recipient).toBe('recipientPlaceholder');
    expect(responseNoti.type).toBe('GENERAL');
    expect(responseNoti.hasRead).toBe(false);
    const insertedNoti = await db.collection('notifications').findOne({ content: 'test content' });
    expect(insertedNoti.content).toBe('test content');
    expect(insertedNoti.recipient).toBe('recipientPlaceholder');
    expect(insertedNoti.type).toBe('GENERAL');
    expect(insertedNoti.hasRead).toBe(false);
  });

  test('createUser exception', async () => {
    try {
      await createNotification('', testNoti);
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
