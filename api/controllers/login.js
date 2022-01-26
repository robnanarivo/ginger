const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbHelper = require('../database/db');
const { getUser } = require('../database/login');

const failures = {};

const loginCtl = async (req, res) => {
  const remoteIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const onLoginFail = () => {
    failures[remoteIp] = failures[remoteIp] || { count: 0, unbanTime: null };
    const f = failures[remoteIp];
    f.count += 1;
    if (f.count >= 5) {
      f.unbanTime = Date.now() + (60 * 1000);
    } else {
      f.unbanTime = Date.now();
    }
  };

  const onLoginSuccess = () => {
    delete failures[remoteIp];
  };

  // Clean up people that have given up
  const MINS10 = 60 * 10000;
  const MINS30 = 3 * MINS10;
  setInterval(() => {
    Object.keys(failures).forEach((ip) => {
      if (Date.now() - failures[ip].unbanTime > MINS10) {
        delete failures[ip];
      }
    });
  }, MINS30);

  const f = failures[remoteIp];
  if (f && f.unbanTime && Date.now() < f.unbanTime) {
    onLoginFail();
    res.status(401).send({ error: 'Too many failed login attempts. Retry in 1 minute.' });
    return;
  }
  const db = dbHelper.getDb();
  try {
    const { email, password } = req.body;
    const user = await getUser(db, email);
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10h',
      });
      res.status(200).json({ token, userId: user._id });
      onLoginSuccess();
    } else {
      res.status(400).send({ error: 'invalid email or password' });
      onLoginFail();
    }
  } catch (err) {
    if (err.code) {
      res.status(err.code).send({ error: err.message });
      return;
    }
    res.status(500).send({ error: err.message });
  }
};

module.exports = loginCtl;
