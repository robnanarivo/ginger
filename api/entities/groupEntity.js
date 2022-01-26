const createGroupInputSchema = {
  type: 'object',
  properties: {
    groupName: { type: 'string' },
    groupType: { enum: ['public', 'private'] },
    topics: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    creatorId: { type: 'string' },
    groupIcon: { type: 'string' },
  },
  required: ['groupName', 'groupType', 'topics', 'creatorId'],
  additionalProperties: false,
};

module.exports = {
  createGroupInputSchema,
};
