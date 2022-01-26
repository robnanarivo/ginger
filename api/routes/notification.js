const express = require('express');
const {
  updateNotificationCtl,
  getNotificationsCtl,
} = require('../controllers/notification');

const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, getNotificationsCtl);
router.put('/:notificationId', verifyToken, updateNotificationCtl);

module.exports = router;
