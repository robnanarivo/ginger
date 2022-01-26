const messageOperations = require('../database/message');
const dbHelper = require('../database/db');

const send = async (req, res) => {
  // console.log('SEND a message');
  const db = dbHelper.getDb();
  try {
    req.body.timestamp = Date.now();
    const newMessage = await messageOperations.createMessage(db, req.body);
    const result = await db.collection('messages').findOne({ _id: newMessage });
    delete Object.assign(result, { id: result['_id'] })['_id'];
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

const get = async (req, res) => {
  // console.log('GET messages');
  const query = {
    chatter1: req.query.chatter1,
    chatter2: req.query.chatter2,
    limit: Number(req.query.limit),
    offset: Number(req.query.offset),
  };
  const db = dbHelper.getDb();
  try {
    const result = await messageOperations.getMessage(db, query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

module.exports = {
  send,
  get,
};
