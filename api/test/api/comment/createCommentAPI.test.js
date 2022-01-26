const request = require('supertest');
const dbHelper = require('../../../database/db');
const { createPost } = require('../../../database/post');
const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
  await db.collection('posts').deleteOne({ title: 'test title' });
  await db.collection('comments').deleteOne({ content: 'test content @testuser' });
  await db.collection('groups').deleteOne({ groupName: 'testgroup' });
};

const login = async (user) => {
  await request(webapp).post('/api/users').send(user);
  const response = await request(webapp).post('/api/login').send(user);
  return response.body;
};

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('create comment endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };
  const testGroup = {
    groupName: 'testgroup',
    groupType: 'public',
    topics: ['popular'],
    groupIcon: '',
    creatorId: '123',
  };
  const testpost = {
    groupId: 'groupIdPlaceholder',
    creatorId: 'creatorIdPlaceholder',
    title: 'test title',
    content: {},
  };
  const testcomment = {
    content: 'test content @testuser',
    userId: 'userIdPlaceholder',
    parentPostId: 'parentPostIdPlaceholder',
  };

  test('successfully create comment, integration test', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    const response = await request(webapp).post('/api/group').set('Authorization', `Bearer ${token}`).send(testGroup);
    expect(response.statusCode).toBe(200);
    const groupId = (await db.collection('groups').findOne({ groupName: 'testgroup' }))._id.toString();
    const postId = await createPost(db, { ...testpost, creatorId: userId, groupId });
    await request(webapp).post('/api/comments').set('Authorization', `Bearer ${token}`).send({ ...testcomment, userId, parentPostId: postId });
    const insertedComment = await db.collection('comments').findOne({ content: 'test content @testuser' });
    expect(insertedComment.userId).toBe(userId);
    expect(insertedComment.parentPostId).toBe(postId.toString());
    expect(insertedComment.content).toBe(testcomment.content);
    await db.collection('notifications').deleteOne({ recipient: userId });
  });
});
