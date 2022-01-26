const { ObjectId } = require('mongodb');
const groupDBOperations = require('../database/group');
const dbHelper = require('../database/db');

const createGroup = async (req, res) => {
  // console.log('CREATE a group');
  // console.log(req.body);
  const db = dbHelper.getDb();
  try {
    const insertedGroup = await groupDBOperations.createGroup(db, req.body);
    const result = await db.collection('groups').findOne({ _id: insertedGroup.insertedId });
    delete Object.assign(result, { id: result['_id'] })['_id'];
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'group with same name already exists') {
      res.status(409).json({ error: err.message });
    } else if (err.message === 'invalid input') {
      res.status(400).json({ error: err.message });
    } else if (err.message === 'Error executing the query') {
      res.status(500).json({ error: err.message });
    } else {
      // console.log(err);
      res.status(404).json({ error: err.message });
    }
  }
};

const updateGroup = async (req, res) => {
  // console.log('UPDATE a group');
  const db = dbHelper.getDb();
  const { groupId } = req.params;
  try {
    await groupDBOperations.updateGroup(db, req, groupId);
    await db.collection('groups').findOne({ _id: ObjectId(groupId) });
    res.status(200).json({ results: 'success' });
  } catch (err) {
    // console.log(err);
    if (err.message === 'group not found') {
      res.status(404).json({ error: err.message });
    } else if (err.message === 'invalid input') {
      res.status(400).json({ error: err.message });
    } else if (err.message === 'Error executing the query') {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

const getGroups = async (req, res) => {
  // console.log('GET groups');
  const db = dbHelper.getDb();
  try {
    const results = await groupDBOperations.getGroups(db, req);
    res.status(200).json(results);
  } catch (err) {
    // console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const getGroup = async (req, res) => {
  // console.log('GET group');
  const db = dbHelper.getDb();
  try {
    if (req.params.groupId.length !== 24) {
      throw new Error('invalid input');
    }
    const result = await groupDBOperations.getGroup(db, req.params.groupId, req.userId.toString());
    if (!result) {
      throw new Error('group not found');
    }
    res.status(200).json(result);
  } catch (err) {
    // console.log(err);
    if (err.message === 'invalid input') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(404).json({ error: err.message });
    }
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
};
