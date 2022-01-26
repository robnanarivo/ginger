const connect = require('../../../database/createConnection');
const postOperations = require('../../../database/post');
const groupOperations = require('../../../database/group');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    await database.collection('groups').deleteOne({ groupName: 'testgroup' });
    await database.collection('posts').deleteOne({ title: 'posttest' });
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

describe('deletePost Database operation tests', () => {
  // test data
  const tp = {
    creatorId: '123',
    groupId: '123',
    title: 'posttest',
    content: { text: '', image: '' },
    timeStamp: 123,
    flaggedBy: [],
    hiddenBy: [],
    comments: [],
  };

  const tg = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '',
  };

  test('deletepost, and integration test', async () => {
    db = await connect(profile.url1);
    const testPost = { ...tp };
    const testGroup = { ...tg };
    const g = await groupOperations.createGroup(db, testGroup);
    Object.assign(testPost, { groupId: g.insertedId.toString() });
    const postId = await postOperations.createPost(db, testPost);
    let post = await db.collection('posts').findOne({ _id: postId });
    expect(post.title).toEqual('posttest');
    await postOperations.deletePost(db, postId);
    // after deletion post no longer in databse
    post = await db.collection('posts').findOne({ _id: postId });
    expect(post).toBe(null);
    // find new post in the DB
  });
});
