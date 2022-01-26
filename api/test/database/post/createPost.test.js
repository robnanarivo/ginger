const connect = require('../../../database/createConnection');
const postOperations = require('../../../database/post');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    await database.collection('posts').deleteOne({ title: 'createposttest' });
  } catch (err) {
    // console.log('error', err.message);
  }
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */

afterEach(async () => {
  await clearDatabase(db);
});

describe('createPost Database operation tests', () => {
  // test data
  const tp = {
    creatorId: '123',
    groupId: '123',
    title: 'createposttest',
    content: { text: '', image: '' },
    timeStamp: 123,
    flaggedBy: [],
    hiddenBy: [],
    comments: [],
  };

  test('createPost create a new post, and integration test', async () => {
    db = await connect(profile.url1);
    const testPost = { ...tp };
    const postId = await postOperations.createPost(db, testPost);
    // find new post in the DB
    const post = await db.collection('posts').findOne({ _id: postId });
    expect(post.title).toEqual('createposttest');
  });
});
