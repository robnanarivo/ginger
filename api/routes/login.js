const express = require('express');

const router = express.Router();
const loginCtl = require('../controllers/login');

router.post('/', loginCtl);

module.exports = router;
