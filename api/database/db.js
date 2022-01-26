const connect = require('./createConnection');
const profile = require('../constants/profile');

let db;

const initDb = async () => {
  if (!db) {
    db = await connect(profile.url1);
  }
  return db;
};

const getDb = () => (db);

module.exports = { initDb, getDb };
