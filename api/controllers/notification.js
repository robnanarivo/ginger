const { ObjectId } = require('mongodb');
const { getNotifications, updateNotification } = require('../database/notification');
const dbHelper = require('../database/db');

const fixId = (notification) => {
  const newNotification = notification;
  Object.assign(newNotification, { notificationId: newNotification._id });
  delete newNotification._id;
  return newNotification;
};

const getNotificationsCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const { userId } = req;
  try {
    const notifications = await getNotifications(db, userId.toString());
    res.status(200).json(notifications.map(fixId));
    return;
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

const updateNotificationCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const { notificationId } = req.params;
  try {
    const notification = await updateNotification(db, ObjectId(notificationId));
    res.status(200).json(fixId(notification));
    return;
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

module.exports = {
  getNotificationsCtl,
  updateNotificationCtl,
};
