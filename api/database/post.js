const { ObjectId } = require('mongodb');

const createPost = async (db, post) => {
  try {
    const postId = (await db.collection('posts').insertOne(post)).insertedId;
    return postId;
  } catch (err) {
    throw new Error('error creating post');
  }
};

const getPost = async (db, postId) => {
  try {
    const post = await db.collection('posts').findOne({ _id: ObjectId(postId) });
    const group = await db.collection('groups').findOne({ _id: ObjectId(post.groupId) });
    Object.assign(post, { admins: group.admins });
    const creator = await db.collection('users').findOne({ _id: ObjectId(post.creatorId) });
    post.creatorName = creator.userName;
    const comments = [];
    await Promise.all(post.comments.map(async (commentId) => {
      const comment = await db.collection('comments').findOne({ _id: ObjectId(commentId) });
      if (comment) {
        const user = await db.collection('users').findOne({ _id: ObjectId(comment.userId) }, { projection: { userName: 1, profilePicture: 1, _id: 0 } });
        delete Object.assign(comment, { id: comment['_id'] })['_id'];
        Object.assign(comment, { ...user });
        comments.push(comment);
      }
    }));
    Object.assign(post, { comments });
    return post;
  } catch (err) {
    // console.log(err);
    throw new Error('error getting post');
  }
};

const deletePost = async (db, postId) => {
  const target = await db.collection('posts').findOne({ _id: postId });
  // remove post from group
  await db.collection('groups').updateOne({ _id: ObjectId(target.groupId) },
    { $pull: { posts: postId.toString() } });
  // remove all comments linked to this group in the data base
  const commentIds = [];
  target.comments.forEach((commentId) => {
    commentIds.push(ObjectId(commentId));
  });
  await db.collection('comments').deleteMany({ _id: { $in: commentIds } });
  // delete post
  const deleted = await db.collection('posts').deleteOne({ _id: postId });
  if (deleted.deletedCount === 0) {
    throw new Error(404, 'comment not found');
  }
  return target;
};

const getGroupPosts = async (db, groupId, userId, limit, offset) => {
  try {
    const group = await db.collection('groups').findOne({ _id: ObjectId(groupId) });
    const { hides } = await db.collection('users').findOne({ _id: ObjectId(userId) });
    // find posts inside group
    const postIds = [];
    const sort = { timestamp: -1 };

    group.posts.forEach((post) => {
      if (!hides.includes(post)) {
        postIds.push(ObjectId(post));
      }
    });

    const posts = await db.collection('posts').find({ _id: { $in: postIds } })
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .toArray();

    await Promise.all(posts.map(async (post) => {
      delete Object.assign(post, { id: post['_id'] })['_id'];
      const usr = await db.collection('users').findOne({ _id: ObjectId(post.creatorId) }, { projection: { _id: 0, userName: 1 } });
      Object.assign(post, { creatorName: usr.userName });
      Object.assign(post, { admins: group.admins });
    }));
    // console.log(posts);

    return posts;
  } catch (err) {
    throw new Error('error getting posts by users');
  }
};

// const getPostsByUser = async (db, creatorId) => {
//   try {
//     // console.log(creatorId);
//     const creator = await db.collection('users').findOne({ _id: ObjectId(creatorId) });
//     const posts = await db.collection('posts').find({ creatorId }).toArray();
//     // console.log(posts);
//     posts.map((rawPost) => {
//       const post = rawPost;
//       post.creatorName = creator.userName;
//       return post;
//     });
//     return posts;
//   } catch (err) {
//     throw new Error('error getting posts by users');
//   }
// };

module.exports = {
  createPost,
  getGroupPosts,
  getPost,
  // getPostsByUser,
  deletePost,
};
