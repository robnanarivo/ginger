const { getUserIdByName } = require('../../database/user');

const parseMention = async (db, text) => {
  const mentionRegex = /(?<=@)[a-zA-Z0-9_]+/g;
  const mentionList = text.match(mentionRegex);
  const recipientList = [];
  await Promise.all(mentionList.map(async (mention) => {
    const id = await getUserIdByName(db, mention);
    if (id !== '') {
      recipientList.push(id);
    }
  }));
  return recipientList;
};

module.exports = {
  parseMention,
};
