function DBError(code, message) {
  this.name = 'DBError';
  if (message) {
    this.message = message;
    this.code = code;
  }
}

const createNotification = async (db, notification) => {
  const record = (await db.collection('notifications').insertOne(notification)).insertedId;
  const newNotification = await db.collection('notifications').findOne({ _id: record });
  return newNotification;
};

const getNotifications = async (db, userId) => {
  const notifications = await db.collection('notifications').find({ recipient: userId, hasRead: false }).toArray();
  return notifications;
};

const updateNotification = async (db, notificationId) => {
  let target = await db.collection('notifications').findOne({ _id: notificationId });
  if (!target) {
    throw new DBError(404, 'notification not found');
  }
  target = { ...target, hasRead: true };
  const updated = await db.collection('notifications').updateOne({ _id: notificationId }, { $set: target });
  if (updated.matchedCount === 0) {
    throw new DBError(404, 'notification not found');
  }
  const updatedNotification = await db.collection('notifications').findOne({ _id: notificationId });
  return updatedNotification;
};

module.exports = { getNotifications, createNotification, updateNotification };
