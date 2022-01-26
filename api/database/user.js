const { ObjectId } = require('mongodb');

function DBError(code, message) {
  this.name = 'DBError';
  if (message) {
    this.message = message;
    this.code = code;
  }
}

const createUser = async (db, newUser) => { // newUser -> newUser with id
  const record = await db.collection('users').findOne({ email: newUser.email });
  if (record) {
    throw new DBError(409, 'user already exists');
  }
  const id = (await db.collection('users').insertOne(newUser)).insertedId;
  const user = await db.collection('users').findOne({ _id: id });
  return user;
};

const updateUser = async (db, user, id) => {
  let target = await db.collection('users').findOne({ _id: id });
  if (!target) {
    throw new DBError(404, 'user not found');
  }
  if ('flags' in user) {
    try {
      const newFlags = user.flags.filter((flag) => !target.flags.includes(flag));
      Promise.all(newFlags.map(async (flag) => {
        const flaggedPost = await db.collection('posts').findOne({ _id: ObjectId(flag) });
        const group = await db.collection('groups').findOne({ _id: ObjectId(flaggedPost.groupId) });
        Promise.all(group.admins.map(async (admin) => {
          const noti = {
            type: 'MENTION',
            recipient: admin,
            params: {
              groupId: group._id.toString(),
              postId: flaggedPost._id.toString(),
            },
            hasRead: false,
            content: `${target.userName} flagged "${flaggedPost.title}"`,
          };
          await db.collection('notifications').insertOne(noti);
        }));
      }));
    } catch (error) {
      // console.log(error);
    }
  }
  target = { ...target, ...user };
  const updated = await db.collection('users').updateOne({ _id: id }, { $set: target });
  if (updated.matchedCount === 0) {
    throw new DBError(404, 'user not found');
  }
  const updatedUser = await db.collection('users').findOne({ _id: id });
  return updatedUser;
};

const getUsers = async (db) => {
  const users = await db.collection('users').find({}).toArray();
  return users;
};

const getUser = async (db, id) => {
  const user = await db.collection('users').findOne({ _id: id });
  if (!user) {
    throw new DBError(404, 'user not found');
  }
  return user;
};

const getUserIdByName = async (db, name) => {
  const user = await db.collection('users').findOne({ userName: name });
  return user ? user._id.toString() : '';
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUser,
  getUserIdByName,
};
