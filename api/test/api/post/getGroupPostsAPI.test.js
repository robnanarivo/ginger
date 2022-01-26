const { ObjectId } = require('mongodb');
const request = require('supertest');
const dbHelper = require('../../../database/db');
const postOperations = require('../../../database/post');
const groupOperations = require('../../../database/group');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  try {
    await db.collection('groups').deleteOne({ groupName: 'testgroup' });
    await db.collection('posts').deleteOne({ title: 'posttest' });
    await db.collection('users').deleteOne({ userName: 'testuser' });
  } catch (err) {
    // console.log(err)
  }
};

const login = async (user) => {
  await request(webapp).post('/api/users').send(user);
  const response = await request(webapp).post('/api/login').send(user);
  return response.body;
};

const prep = async (testUser, testGroup, testPost) => {
  await request(webapp).post('/api/users').send(testUser);
  const { token, userId } = await login(testUser);
  Object.assign(testGroup, { creatorId: userId });
  const g = await groupOperations.createGroup(db, testGroup);
  Object.assign(testPost, { groupId: g.insertedId.toString() });
  Object.assign(testPost, { creatorId: userId });
  const postId = await postOperations.createPost(db, testPost);
  await db.collection('groups').updateOne({ _id: ObjectId(testPost.groupId) },
    { $push: { posts: postId.toString() } });
  const post = await db.collection('posts').findOne({ _id: postId });
  return { post, token };
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('GetGroupPosts endpoint API & integration tests', () => {
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

  test('successfully getGroupPosts & integration test', async () => {
    const { post, token } = await prep(tu, tg, tp);
    await request(webapp)
      .get(`/api/posts/groupPosts?groupId=${post.groupId}&offset=0&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(async (response) => {
        const resp = JSON.parse(response.text);
        const p = await db.collection('posts').findOne({ _id: ObjectId(post._id) });
        expect(resp[0].title).toBe(p.title);
      })
      .then(() => {});
  });
});
