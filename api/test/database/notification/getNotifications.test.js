const connect = require('../../../database/createConnection');
const { getNotifications, createNotification } = require('../../../database/notification');
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
    await createNotification(db, testNoti);
    const notiList = await getNotifications(db, 'recipientPlaceholder');
    expect(notiList.length).toBe(1);
    expect(notiList[0].content).toBe('test content');
    expect(notiList[0].recipient).toBe('recipientPlaceholder');
    expect(notiList[0].type).toBe('GENERAL');
    expect(notiList[0].hasRead).toBe(false);
  });

  test('createUser exception', async () => {
    try {
      await getNotifications('', 'recipientPlaceholder');
    } catch (err) {
      expect(err.message).toBe('db.collection is not a function');
    }
  });
});
