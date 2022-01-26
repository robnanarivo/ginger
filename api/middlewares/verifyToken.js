const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (typeof bearerHeader === 'undefined') {
    res.status(401).send({ error: 'unauthorized' });
    return;
  }
  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).send({ error: 'JWT_SECRET not set' });
    }
    const authData = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.userId = authData.userId;
    next();
  } catch (err) {
    res.status(403).send({ error: 'forbidden' });
  }
};

module.exports = verifyToken;
