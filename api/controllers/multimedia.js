const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const { GridFSBucket } = require('mongodb');
const { ObjectId } = require('mongodb');
const { url1 } = require('../constants/profile');
const dbHelper = require('../database/db');

const mongoURI = url1;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => (
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          reject(err);
          return;
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'multimedia',
        };
        resolve(fileInfo);
      });
    })
  ),
});

const upload = multer({
  storage,
});

const download = async (req, res) => {
  // console.log('DOWNLOAD image');
  const db = dbHelper.getDb();
  const bucket = new GridFSBucket(db, { bucketName: 'multimedia' });

  try {
    bucket.openDownloadStream(ObjectId(req.params.id)).pipe(res);
  } catch (err) {
    res.status(404).send({ error: 'resource not found' });
  }
};

module.exports = {
  upload,
  download,
};
