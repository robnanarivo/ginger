const Ajv = require('ajv');
// const { ObjectId } = require('mongodb');
const { ObjectId } = require('mongodb');
const dbHelper = require('../database/db');
const postEntities = require('../entities/postEntity');
const dblib = require('../database/post');
const { parseMention } = require('../shared/mention/mention');
const { createNotification } = require('../database/notification');

const ajv = new Ajv({ useDefaults: true });

const createValidator = ajv.compile(postEntities.createPostInputSchema);
// const updateValidator = ajv.compile(userEntities.updateUserInputSchema);

const fixId = (post) => {
  const newPost = post;
  Object.assign(newPost, { postId: newPost._id });
  delete newPost._id;
  return newPost;
};

const createPost = async (req, res) => {
  const db = dbHelper.getDb();
  const post = req.body;
  if (!createValidator(post)) {
    res.status(400).json({ error: 'invalid input' });
    return;
  }
  try {
    // console.log('CREATE post');
    post.timestamp = Date.now();
    post.flaggedBy = [];
    post.hiddenBy = [];
    post.comments = [];
    const postId = await dblib.createPost(db, post);
    await db.collection('groups').updateOne(
      { _id: ObjectId(post.groupId) },
      { $push: { posts: postId.toString() } },
    );
    if (post.content.text) {
      const recipientList = await parseMention(db, post.content.text);
      Promise.all(recipientList.map(async (recipientId) => {
        await createNotification(db, {
          type: 'MENTION',
          recipient: recipientId,
          content: `You are mentioned in post "${post.title}".`,
          params: {
            postId: post._id.toString(),
            groupId: post.groupId,
          },
          hasRead: false,
        });
      }));
    }
    res.status(201).json(fixId(post));
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

const deletePost = async (req, res) => {
  // console.log('DELETE POST');
  const { postId } = req.params;
  const db = dbHelper.getDb();
  try {
    if (!ObjectId.isValid(postId)) {
      return res.status(404).send({ error: 'post not found' });
    }
    const deletedPost = await dblib.deletePost(db, ObjectId(postId));
    // console.log(deletedPost);
    return res.status(200).send(deletedPost);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).send({ error: error.message });
    }
    return res.status(500).send({ error: 'server error' });
  }
};

const getPost = async (req, res) => {
  try {
    const db = dbHelper.getDb();
    // console.log('GET post');
    const post = await dblib.getPost(db, req.params.postId);
    if (!post) {
      throw new Error('post not found');
    }
    // console.log(post);
    res.status(201).json(fixId(post));
  } catch (err) {
    // console.log(err);
    if (err.message === 'post not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'server error' });
    }
  }
};

const getGroupPosts = async (req, res) => {
  try {
    const db = dbHelper.getDb();
    // console.log('GET GROUP POSTS');
    // console.log(req.body);
    const posts = await dblib.getGroupPosts(
      db, req.query.groupId, req.userId, Number(req.query.limit), Number(req.query.offset),
    );
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

// const getPostsByUser = async (req, res) => {
//   try {
//     const db = dbHelper.getDb();
//     // console.log(`GET posts of user ${req.query.userId}`);
//     const posts = await dblib.getPostsByUser(db, req.query.userId);
//     posts.forEach((post) => {
//       fixId(post);
//     });
//     res.status(201).json(posts);
//   } catch (err) {
//     res.status(500).json({ error: 'server error' });
//   }
// };

module.exports = {
  createPost,
  getPost,
  deletePost,
  getGroupPosts,
  // getPostsByUser,
};
