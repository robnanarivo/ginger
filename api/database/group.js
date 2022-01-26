const Ajv = require('ajv');
// Import ObjectID constructor
const { ObjectId } = require('mongodb');
const groupEntity = require('../entities/groupEntity');

const ajv = new Ajv();

// create a group
const createGroup = async (db, ng) => {
  const newGroup = { ...ng };
  const validator = ajv.compile(groupEntity.createGroupInputSchema);
  let result;
  let p;
  // check for input
  if (!validator(newGroup)) {
    // console.log(validator.errors);
    throw new Error('invalid input');
  }

  try {
    p = await db.collection('groups').findOne({ groupName: newGroup.groupName });
  } catch (err) {
    // throw new Error(err.message);
    throw new Error('Error executing the query');
  }

  if (p) {
    throw new Error('group with same name already exists');
  }
  newGroup.applicantIds = [];
  newGroup.users = [newGroup.creatorId];
  newGroup.admins = [newGroup.creatorId];
  newGroup.posts = [];
  newGroup.timeStamp = Date.now();
  try {
    result = await db.collection('groups').insertOne(newGroup);
    // console.log(`Created group with id: ${result.insertedId}`);
  } catch (err) {
    // console.log(`error: ${err.message}`);
    // throw new Error(err.message);
    throw new Error('Error executing the query');
  }
  return result;
};

// update group info
const updateGroup = async (db, req, groupId) => {
  if (!groupId || !req.body.action || req.body.action === '') {
    throw new Error('invalid input');
  }
  const grp = await db.collection('groups').findOne({ _id: ObjectId(groupId) });
  if (!grp) {
    throw new Error('group not found');
  }
  const act = req.body.action;
  // user join/append to apply list / leave
  if (req.body.userIds && req.body.userIds.length > 0) {
    // user join group
    if (act === 'join') {
      await Promise.all(req.body.userIds.map(async (userId) => {
        const res = await db.collection('groups').findOne({ _id: ObjectId(groupId), applicantIds: userId });
        if (res) {
          await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
            { $pull: { applicantIds: userId } });
          const response = await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
            { $addToSet: { users: userId } });
          if (response.modifiedCount === 1) {
            const noti = {
              type: 'GENERAL',
              recipient: userId,
              params: {},
              content: `You have been accepted to join ${grp.groupName}`,
              hasRead: false,
            };
            await db.collection('notifications').insertOne(noti);
          }
        }
      }));
      // console.log('user joins group');
    } else if (act === 'leave') {
      // user leave group
      await Promise.all(req.body.userIds.map(async (userId) => {
        let response = await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $pull: { applicantIds: userId } });
        await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $pull: { admins: userId } });
        if (response.modifiedCount === 1) {
          const noti = {
            type: 'GENERAL',
            recipient: userId,
            params: {},
            content: `You have been rejected to join ${grp.groupName}`,
            hasRead: false,
          };
          await db.collection('notifications').insertOne(noti);
        }
        response = await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $pull: { users: userId } });
        if (response.modifiedCount === 1) {
          const noti = {
            type: 'GENERAL',
            recipient: userId,
            params: {},
            content: `You have been removed from ${grp.groupName}`,
            hasRead: false,
          };
          await db.collection('notifications').insertOne(noti);
        }
      }));
      // console.log('user leaves group');
    } else if (act === 'apply') {
      // user join pending list
      // console.log(req.body.userIds);
      await Promise.all(req.body.userIds.map(async (userId) => {
        await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $addToSet: { applicantIds: userId } });
      }));
      // console.log('user joins applicants list');
      const adminIds = (await db.collection('groups').findOne({ _id: ObjectId(groupId) })).admins;
      await Promise.all(req.body.userIds.map(async (userId) => {
        const applicant = await db.collection('users').findOne({ _id: ObjectId(userId) });
        await Promise.all(adminIds.map(async (adminId) => {
          const noti = {
            type: 'APPLY',
            recipient: adminId,
            content: `${applicant.userName} applied to join ${grp.groupName}`,
            params: {
              groupId,
              userId,
            },
            hasRead: false,
          };
          await db.collection('notifications').insertOne(noti);
        }));
      }));
    }
  // admin add/ leave
  } else if (req.body.adminIds && req.body.adminIds.length > 0) {
    if (act === 'join') {
      await Promise.all(req.body.adminIds.map(async (adminId) => {
        await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $addToSet: { admins: adminId } });
      }));
      // console.log('add admin');
    } else if (act === 'leave') {
      await Promise.all(req.body.adminIds.map(async (adminId) => {
        await db.collection('groups').updateOne({ _id: ObjectId(groupId) },
          { $pull: { admins: adminId } });
      }));
      // console.log('remove admin');
    }
  }
  const g = await db.collection('groups').findOne({ _id: ObjectId(groupId) });
  return g;
};

// get groups by topic
const getGroups = async (db, req) => {
  const { topic } = req.params;
  const { userId } = req;
  const topicRegex = new RegExp(['^', topic, '$'].join(''), 'i');
  let results;
  try {
    if (!topic || topic === 'public') {
      results = await db.collection('groups').find(
        { groupType: topic },
        {
          projection:
            {
              _id: 1, groupIcon: 1, groupName: 1, pending: 1, users: 1,
            },
        },
      ).toArray();
    } else if (topic === 'private') {
      results = await db.collection('groups').find(
        { groupType: topic, users: userId },
        {
          projection:
            {
              _id: 1, groupIcon: 1, groupName: 1, pending: 1, users: 1,
            },
        },
      ).toArray();
    } else if (topic === 'joined') {
      results = await db.collection('groups').find(
        { users: userId },
        {
          projection:
            {
              _id: 1, groupIcon: 1, groupName: 1, pending: 1, users: 1,
            },
        },
      ).toArray();
    } else if (topic === 'suggestions') {
      const joined = await db.collection('groups').find(
        { users: userId },
        {
          projection:
            {
              _id: 1, topics: 1,
            },
        },
      ).toArray();
      const userTopics = {};
      joined.forEach((group) => {
        group.topics.forEach((topicItem) => {
          if (topic in userTopics) {
            userTopics[topicItem] += 1;
          } else {
            userTopics[topicItem] = 1;
          }
        });
      });
      const sortedTopics = Object.entries(userTopics)
        .sort(([, a], [, b]) => a - b)
        .map((entry) => entry[0]);
      const topTopics = sortedTopics.slice(0, 5);
      if (topTopics.length === 0) {
        results = [];
      } else {
        const suggestions = await db.collection('groups').find(
          { $and: [{ topics: { $in: topTopics } }, { groupType: 'public' }] },
          {
            projection:
              {
                _id: 1, groupIcon: 1, groupName: 1, pending: 1, users: 1,
              },
          },
        ).toArray();
        results = suggestions.filter((group) => !(group.users.includes(userId)));
      }
    } else {
      results = await db.collection('groups').find(
        { groupType: 'public', topics: topicRegex },
        {
          projection:
            {
              _id: 1, groupIcon: 1, groupName: 1, pending: 1, users: 1,
            },
        },
      ).toArray();
    }

    await Promise.all(results.map(async (result) => {
      let userStatus = await db.collection('groups').findOne({ _id: result._id, users: userId }) ? 'joined' : 'not joined';
      userStatus = await db.collection('groups').findOne({ _id: result._id, applicantIds: userId }) ? 'pending' : userStatus;
      delete Object.assign(result, { member: result.users.length, userStatus })['users'];
    }));
    results.forEach((result) => { delete Object.assign(result, { groupId: result['_id'] })['_id']; });
  } catch (err) {
    // console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
  return results;
};

// get group by id
const getGroup = async (db, id, userId) => {
  let result;
  try {
    result = await db.collection('groups').findOne({ _id: ObjectId(id) });
    let userStatus = await db.collection('groups').findOne({ _id: ObjectId(id), users: userId }) ? 'joined' : 'not join';
    userStatus = await db.collection('groups').findOne({ _id: ObjectId(id), applicantIds: userId }) ? 'pending' : userStatus;
    // console.log(userStatus);
    const isAdmin = !!await db.collection('groups').findOne({ _id: ObjectId(id), admins: userId });
    // const joined = await db.collection('groups').findOne({ _id: ObjectId(id), users });
    delete Object.assign(result, { id: result['_id'] })['_id'];
    const createTime = new Date(result.timeStamp);
    // gather user information
    const users = [];
    await Promise.all(result.users.map(async (i) => {
      const user = await db.collection('users').findOne({ _id: ObjectId(i) }, { projection: { userName: 1, profilePicture: 1, _id: 1 } });
      delete Object.assign(user, { id: user['_id'] })['_id'];
      if (user) {
        users.push(user);
      }
    }));
    Object.assign(result, { users });
    // gather group information
    Object.assign(result,
      {
        groupInfo: {
          member: result.users.length,
          createOn: `${createTime.getMonth() + 1}/${createTime.getDate()}/${createTime.getFullYear()}`,
        },
        userStatus,
        isAdmin,
      });
    // find admin of the group
    const admins = [];
    await Promise.all(result.admins.map(async (adminId) => {
      const admin = await db.collection('users').findOne({ _id: ObjectId(adminId) }, { projection: { userName: 1, profilePicture: 1, _id: 1 } });
      delete Object.assign(admin, { id: admin['_id'] })['_id'];
      if (admin) {
        admins.push(admin);
      } else {
        admins.push('Admin A');
      }
    }));
    Object.assign(result, { admins });
  } catch (err) {
    throw new Error('Error executing the query');
  }
  return result;
};

module.exports = {
  createGroup,
  updateGroup,
  getGroups,
  getGroup,
};
