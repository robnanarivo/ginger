const connect = require('../../../database/createConnection');
const { createMessage } = require('../../../database/message');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  await database.collection('messages').deleteOne({ sender: 'testuser1' });
};

afterEach(async () => {
  await clearDatabase(db);
});

describe('create new message Database operation tests', () => {
  // test data
  const testMessage = {
    sender: 'testuser1',
    recipient: 'testuser2',
    message: {},
    timeStamp: Date.now(),
  };

  test('createUser integrity test', async () => {
    db = await connect(profile.url1);
    const id = await createMessage(db, testMessage);
    // find new user in the DB
    const insertedMessage = await db.collection('messages').findOne({ _id: id });
    expect(insertedMessage.sender).toEqual('testuser1');
    expect(insertedMessage.recipient).toEqual('testuser2');
    expect(insertedMessage.message).toEqual({});
    expect(insertedMessage.timeStamp).toBeGreaterThan(0);
  });
});
