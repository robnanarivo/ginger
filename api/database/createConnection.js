// Import MongoDB module
const { MongoClient } = require('mongodb');
// Connect to our db on the cloud
const connect = async (url) => {
  try {
    const tmp = (
      await MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
      )
    ).db();
    // Connected to db
    // console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    // console.error(err.message);
    throw new Error('could not connect to the db');
  }
};

module.exports = connect;
