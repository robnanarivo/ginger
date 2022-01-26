const express = require('express');
const multimedia = require('../controllers/multimedia');

const router = express.Router();

router.post('/', multimedia.upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

router.get('/:id', multimedia.download);

module.exports = router;
