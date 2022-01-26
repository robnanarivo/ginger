const connect = require('../../../database/createConnection');
const { createComment, updateComment } = require('../../../database/comment');
const { createPost } = require('../../../database/post');
const profile = require('../../../constants/profile');

let db;
// cleanup the database after each test
const clearDatabase = async (database) => {
  try {
    const result = await database.collection('comments').deleteOne({ content: 'test content' });
    await database.collection('posts').deleteOne({ title: 'test title' });
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

describe('updateComment Database operation tests', () => {
  const testpost = {
    groupId: 'groupIdPlaceholder',
    creatorId: 'creatorIdPlaceholder',
    title: 'test title',
    content: {},
    timeStamp: Date.now(),
  };
  const testcomment = {
    content: 'test content',
    userId: 'userIdPlaceholder',
    timeStamp: Date.now(),
    parentPostId: 'parentPostIdPlaceholder',
  };

  test('updateComment integrity test', async () => {
    db = await connect(profile.url1);
    const postId = await createPost(db, testpost);
    const comment = await createComment(db, { ...testcomment, parentPostId: postId });
    const updatedComment = await updateComment(db, { ...comment, userId: 'newuserIdPlaceholder' }, comment._id);
    expect(updatedComment.content).toEqual('test content');
    expect(updatedComment.userId).toEqual('newuserIdPlaceholder');
    expect(updatedComment.parentPostId).toEqual(postId);
  });

  test('getComment exception', async () => {
    try {
      await updateComment(db, { ...testcomment, userId: 'newuserIdPlaceholder' }, 'invalid post id');
    } catch (err) {
      expect(err.message).toBe('comment not found');
    }
  });
});
