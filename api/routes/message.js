const express = require('express');
const message = require('../controllers/message');

const router = express.Router();

router.post('/', message.send);
router.get('/', message.get);

module.exports = router;
