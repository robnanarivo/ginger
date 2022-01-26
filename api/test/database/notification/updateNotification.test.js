const connect = require('../../../database/createConnection');
const { updateNotification, createNotification } = require('../../../database/notification');
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

describe('update notification Database operation tests', () => {
  const testNoti = {
    params: {},
    recipient: 'recipientPlaceholder',
    type: 'GENERAL',
    content: 'test content',
    hasRead: false,
  };

  test('update notification integrity test', async () => {
    db = await connect(profile.url1);
    const responseNoti = await createNotification(db, testNoti);
    const updatedNoti = await updateNotification(db, responseNoti._id);
    expect(updatedNoti.content).toBe('test content');
    expect(updatedNoti.recipient).toBe('recipientPlaceholder');
    expect(updatedNoti.type).toBe('GENERAL');
    expect(updatedNoti.hasRead).toBe(true);
  });

  test('update notification exception', async () => {
    try {
      await updateNotification('', '111111111111111111111111');
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
    try {
      db = await connect(profile.url1);
      await updateNotification(db, '111111111111111111111111');
    } catch (err) {
      expect(err.message).toBe('notification not found');
    }
  });
});
