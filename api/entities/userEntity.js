const createUserInputSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string', pattern: '^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$' },
    userName: { type: 'string' },
    password: { type: 'string', pattern: '^[0-9a-zA-Z]{8,}$' },
    profilePicture: { type: 'string', default: '' },
    flags: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: [],
    },
    hides: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: [],
    },
    isActive: { type: 'boolean', default: true },
    registrationDate: { type: 'string' },
  },
  required: ['email', 'userName', 'password'],
  additionalProperties: false,
};

const updateUserInputSchema = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    password: { type: 'string', pattern: '^[0-9a-zA-Z]{8,}$' },
    profilePicture: { type: 'string' },
    flags: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    },
    hides: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    },
    isActive: { type: 'boolean' },
  },
  additionalProperties: false,
};

module.exports = { createUserInputSchema, updateUserInputSchema };
