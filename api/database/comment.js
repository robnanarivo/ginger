const { ObjectId } = require('mongodb');

function DBError(code, message) {
  this.name = 'DBError';
  if (message) {
    this.message = message;
    this.code = code;
  }
}

const createComment = async (db, newComment) => {
  const parentPost = await db.collection('posts').findOne({ _id: ObjectId(newComment.parentPostId) });
  if (!parentPost) {
    throw new DBError(404, 'parent post not found');
  }
  const id = (await db.collection('comments').insertOne(newComment)).insertedId;
  await db.collection('posts').updateOne({ _id: parentPost._id },
    { $push: { comments: id.toString() } });
  const record = await db.collection('comments').findOne({ _id: id });
  return record;
};

const getComment = async (db, commentId) => {
  const record = await db.collection('comments').findOne({ _id: commentId });
  if (!record) {
    throw new DBError(404, 'comment not found');
  }
  return record;
};

const updateComment = async (db, comment, commentId) => {
  let target = await db.collection('comments').findOne({ _id: commentId });
  if (!target) {
    throw new DBError(404, 'comment not found');
  }
  target = { ...target, ...comment };
  const updated = await db.collection('comments').updateOne({ _id: commentId }, { $set: target });
  if (updated.matchedCount === 0) {
    throw new DBError(404, 'comment not found');
  }
  const updatedComment = await db.collection('comments').findOne({ _id: commentId });
  return updatedComment;
};

const deleteComment = async (db, commentId) => {
  const target = await db.collection('comments').findOne({ _id: commentId });
  if (!target) {
    throw new DBError(404, 'comment not found');
  }
  await db.collection('posts').updateOne({ _id: ObjectId(target.parentPostId) },
    { $pull: { comments: commentId.toString() } });
  const deleted = await db.collection('comments').deleteOne({ _id: commentId });
  if (deleted.deletedCount === 0) {
    throw new DBError(404, 'comment not found');
  }
  return target;
};

module.exports = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
};
