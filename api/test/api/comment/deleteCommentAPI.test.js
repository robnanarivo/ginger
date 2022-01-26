const request = require('supertest');
const dbHelper = require('../../../database/db');
const { createPost } = require('../../../database/post');
const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  await db.collection('users').deleteOne({ userName: 'testuser' });
  await db.collection('posts').deleteOne({ title: 'test title' });
  await db.collection('comments').deleteOne({ content: 'test content' });
  await db.collection('comments').deleteOne({ content: 'test content2' });
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

describe('delete comment endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };
  const testpost = {
    groupId: 'groupIdPlaceholder',
    creatorId: 'creatorIdPlaceholder',
    title: 'test title',
    content: {},
  };
  const testcomment = {
    content: 'test content',
    userId: 'userIdPlaceholder',
    parentPostId: 'parentPostIdPlaceholder',
  };

  test('successfully delete comment, integration test', async () => {
    db = await dbHelper.getDb();
    await request(webapp).post('/api/users').send(testuser);
    const { userId, token } = await login(testuser);
    const postId = await createPost(db, { ...testpost, creatorId: userId });
    await request(webapp).post('/api/comments').set('Authorization', `Bearer ${token}`).send({ ...testcomment, userId, parentPostId: postId });
    const commentInDB = await db.collection('comments').findOne({ content: 'test content' });
    const response = await request(webapp).delete(`/api/comments/${commentInDB._id}`).set('Authorization', `Bearer ${token}`);
    expect(response.body.content).toBe('test content');
    const shouldbeNull = await db.collection('comments').findOne({ content: 'test content' });
    expect(shouldbeNull).toBeNull();
  });
});
