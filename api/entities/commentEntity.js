const createCommentEntity = {
  type: 'object',
  properties: {
    commentId: { type: 'string' },
    userId: { type: 'string' },
    content: { type: 'string' },
    timeStamp: { type: 'string' },
    parentPostId: { type: 'string' },
  },
  required: ['content', 'parentPostId'],
  additionalProperties: false,
};

const updateCommentEntity = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: ['content'],
  additionalProperties: false,
};

module.exports = { createCommentEntity, updateCommentEntity };
