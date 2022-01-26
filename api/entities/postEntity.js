const createPostInputSchema = {
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    creatorId: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'object' },
  },
  required: ['groupId', 'title', 'content', 'creatorId'],
  additionalProperties: false,
};

module.exports = {
  createPostInputSchema,
};
