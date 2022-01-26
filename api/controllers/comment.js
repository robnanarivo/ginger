const Ajv = require('ajv');
const { ObjectId } = require('mongodb');
const dbHelper = require('../database/db');
const { createCommentEntity, updateCommentEntity } = require('../entities/commentEntity');
const { getPost } = require('../database/post');
const {
  createComment,
  updateComment,
  deleteComment,
  getComment,
} = require('../database/comment');
const { parseMention } = require('../shared/mention/mention');
const { createNotification } = require('../database/notification');

const ajv = new Ajv();

const createValidator = ajv.compile(createCommentEntity);
const updateValidator = ajv.compile(updateCommentEntity);

const fixId = (comment) => {
  const newComment = comment;
  Object.assign(newComment, { commentId: newComment._id });
  delete newComment._id;
  return newComment;
};

const createCommentCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const comment = req.body;
  if (!createValidator(comment)) {
    return res.status(400).send({
      error: 'invalid input',
    });
  }
  try {
    comment.timeStamp = Date.now();
    comment.userId = req.userId.toString();
    const newComment = await createComment(db, comment);
    const post = await getPost(db, comment.parentPostId);
    if (newComment.content !== '') {
      const recipientList = await parseMention(db, newComment.content);
      Promise.all(recipientList.map(async (recipientId) => {
        await createNotification(db, {
          type: 'MENTION',
          recipient: recipientId,
          content: `You are mentioned in a comment in post "${post.title}"`,
          params: {
            postId: post._id.toString(),
            groupId: post.groupId.toString(),
          },
          hasRead: false,
        });
      }));
    }
    return res.status(201).send(fixId(newComment));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).send({ error: error.message });
    }
    return res.status(400).send({ error: 'server error' });
  }
};

const getCommentCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send({ error: 'comment not found' });
    }
    const targetComment = await getComment(db, ObjectId(id));
    return res.status(200).send(fixId(targetComment));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).send({ error: error.message });
    }
    return res.status(500).send({ error: 'server error' });
  }
};

const updateCommentCtl = async (req, res) => {
  const targetCommentId = req.params.id;
  const db = dbHelper.getDb();
  const comment = req.body;
  if (!updateValidator(comment)) {
    return res.status(400).send({
      error: 'invalid input',
    });
  }
  try {
    if (!ObjectId.isValid(targetCommentId)) {
      return res.status(404).send({ error: 'comment not found' });
    }
    const targetComment = await getComment(db, ObjectId(targetCommentId));
    if (targetComment.userId !== req.userId.toString()) {
      return res.status(403).send({ error: 'forbidden' });
    }
    const updatedComment = await updateComment(db, comment, ObjectId(targetCommentId));
    return res.status(200).send(fixId(updatedComment));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).send({ error: error.message });
    }
    return res.status(500).send({ error: 'server error' });
  }
};

const deleteCommentCtl = async (req, res) => {
  // console.log('DELETE COMMENT');
  const { id } = req.params;
  const db = dbHelper.getDb();
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send({ error: 'comment not found' });
    }
    const deletedComment = await deleteComment(db, ObjectId(id));
    return res.status(200).send(fixId(deletedComment));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).send({ error: error.message });
    }
    return res.status(500).send({ error: 'server error' });
  }
};

module.exports = {
  createCommentCtl,
  getCommentCtl,
  updateCommentCtl,
  deleteCommentCtl,
};
