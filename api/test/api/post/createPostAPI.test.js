const { ObjectId } = require('mongodb');
const request = require('supertest');
const dbHelper = require('../../../database/db');

const webapp = require('../../../app');

let db;

const clearDatabase = async () => {
  try {
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

beforeAll(async () => {
  db = await dbHelper.initDb();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Create post endpoint API & integration tests', () => {
  const testuser = {
    email: 'johnSnow@noob.com',
    userName: 'testuser',
    password: 'Password123',
  };
  const tp = {
    creatorId: '123',
    groupId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
    title: 'posttest',
    content: { text: '', image: '' },
  };

  test('successfully create post & integration test', async () => {
    await request(webapp).post('/api/users').send(testuser);
    const { token } = await login(testuser);

    await request(webapp)
      .post('/api/posts/')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...tp })
      .expect(201)
      .then(async (response) => {
        const resp = JSON.parse(response.text);
        const post = await db.collection('posts').findOne({ _id: ObjectId(resp.postId) });
        expect(resp.creatorId).toEqual(post.creatorId);
        expect(resp.groupId).toEqual(post.groupId);
      })
      .then(() => {});
  });
});
