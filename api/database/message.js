const createMessage = async (db, message) => {
  try {
    const newMessage = await db.collection('messages').insertOne(message);
    return newMessage.insertedId;
  } catch (err) {
    throw new Error('Error adding message');
  }
};

const getMessage = async (db, {
  chatter1, chatter2, offset, limit,
}) => {
  try {
    const sort = { timestamp: 1 };
    const reverse = { timestamp: -1 };
    const find = {
      $or: [{ sender: chatter1, recipient: chatter2 }, { sender: chatter2, recipient: chatter1 }],
    };
    const messages = await db.collection('messages').find(find)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .sort(reverse)
      .toArray();

    return messages;
  } catch (err) {
    throw new Error('Error retrieving message');
  }
};

module.exports = {
  createMessage,
  getMessage,
};
