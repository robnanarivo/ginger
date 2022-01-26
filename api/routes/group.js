// Import database operations
const express = require('express');
const group = require('../controllers/group');

const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.post('/group', verifyToken, group.createGroup);
router.get('/group/:groupId', verifyToken, group.getGroup);
router.get('/groups/:topic', verifyToken, group.getGroups);
router.put('/group/:groupId', verifyToken, group.updateGroup);

module.exports = router;
