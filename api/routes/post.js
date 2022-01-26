// Import database operations
const express = require('express');
const post = require('../controllers/post');

const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.post('/', post.createPost);
router.get('/groupPosts', verifyToken, post.getGroupPosts);
router.get('/:postId', post.getPost);
router.delete('/:postId', post.deletePost);
// router.get('/', post.getPostsByUser);

module.exports = router;
