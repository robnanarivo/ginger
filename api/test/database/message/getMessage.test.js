const connect = require('../../../database/createConnection');
const { createMessage, getMessage } = require('../../../database/message');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  await database.collection('messages').deleteOne({ sender: 'testuser1' });
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('get new message Database operation tests', () => {
  // test data
  const testMessage = {
    sender: 'testuser1',
    recipient: 'testuser2',
    message: {},
    timeStamp: Date.now(),
  };

  test('getMessage integrity test', async () => {
    db = await connect(profile.url1);
    await createMessage(db, testMessage);
    const messages = await getMessage(db,
      {
        chatter1: 'testuser1',
        chatter2: 'testuser2',
        offset: 0,
        limit: 1,
      });
    expect(messages.length).toEqual(1);
    expect(messages[0].sender).toEqual('testuser1');
    expect(messages[0].recipient).toEqual('testuser2');
    expect(messages[0].message).toEqual({});
    expect(messages[0].timeStamp).toBeGreaterThan(0);
  });
});
