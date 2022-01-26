// Import database operations
const express = require('express');
const {
  createUserCtl,
  updateUserCtl,
  getUsersCtl,
  getUserCtl,
} = require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/', createUserCtl);
router.put('/:id', verifyToken, updateUserCtl);
router.get('/', verifyToken, getUsersCtl);
router.get('/:id', verifyToken, getUserCtl);

module.exports = router;
