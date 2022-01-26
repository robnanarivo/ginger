const { ObjectId } = require('mongodb');
const connect = require('../../../database/createConnection');
const postOperations = require('../../../database/post');
const userOperations = require('../../../database/user');
const groupOperations = require('../../../database/group');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    await database.collection('groups').deleteOne({ groupName: 'testgroup' });
    await database.collection('posts').deleteOne({ title: 'posttest' });
    await database.collection('users').deleteOne({ userName: 'testuser' });
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

describe('getGroupPosts Database operation tests', () => {
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

  const tu = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
    hides: [],
  };

  test('getGroupPosts, and integration test', async () => {
    db = await connect(profile.url1);
    const testPost = { ...tp };
    const testGroup = { ...tg };
    const testUser = { ...tu };
    const u = await userOperations.createUser(db, testUser);
    Object.assign(testGroup, { creatorId: u._id.toString() });
    const g = await groupOperations.createGroup(db, testGroup);
    Object.assign(testPost, { groupId: g.insertedId.toString() });
    Object.assign(testPost, { creatorId: u._id.toString() });
    const postId = await postOperations.createPost(db, testPost);
    await db.collection('groups').updateOne({ _id: ObjectId(testPost.groupId) },
      { $push: { posts: postId.toString() } });
    const posts = await postOperations.getGroupPosts(db, testPost.groupId,
      testPost.creatorId, 10, 0);
    expect(posts.length).toEqual(1);
    expect(posts[0].title).toEqual('posttest');
  });
});
