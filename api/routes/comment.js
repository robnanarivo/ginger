const express = require('express');
const {
  createCommentCtl,
  getCommentCtl,
  updateCommentCtl,
  deleteCommentCtl,
} = require('../controllers/comment');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/', verifyToken, createCommentCtl);
router.get('/:id', verifyToken, getCommentCtl);
router.put('/:id', verifyToken, updateCommentCtl);
router.delete('/:id', verifyToken, deleteCommentCtl);

module.exports = router;
