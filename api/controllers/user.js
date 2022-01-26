const Ajv = require('ajv');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('bson');
const dbHelper = require('../database/db');
const userEntities = require('../entities/userEntity');
const {
  createUser, updateUser, getUsers, getUser,
} = require('../database/user');

const ajv = new Ajv({ useDefaults: true });

const createValidator = ajv.compile(userEntities.createUserInputSchema);
const updateValidator = ajv.compile(userEntities.updateUserInputSchema);

const fixId = (user) => {
  const newUser = user;
  Object.assign(newUser, { userId: newUser._id });
  delete newUser._id;
  newUser.password = '';
  return newUser;
};

const createUserCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const user = req.body;
  if (!createValidator(user)) {
    res.status(400).json({ error: 'invalid input' });
    return;
  }
  try {
    user.registrationDate = Date.now();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newPlayer = await createUser(db, user);
    res.status(201).json(fixId(newPlayer));
  } catch (error) {
    if (error.code) {
      res.status(error.code).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'server error' });
    }
  }
};

const updateUserCtl = async (req, res) => {
  const db = dbHelper.getDb();
  const user = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send({ error: 'user not found' });
  }
  const id = ObjectId(req.params.id);
  if (!updateValidator(user)) {
    return res.status(400).send({ error: 'invalid input' });
  }
  try {
    if ('password' in user) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
    const newUser = await updateUser(db, user, id);
    return res.status(200).json(fixId(newUser));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ error: error.message });
    }
    return res.status(500).json({ error: 'server error' });
  }
};

const getUsersCtl = async (req, res) => {
  const db = dbHelper.getDb();
  try {
    const users = await getUsers(db);
    res.status(200).json(users.map(fixId));
  } catch (error) {
    if (error.code) {
      res.status(error.code).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'server error' });
    }
  }
};

const getUserCtl = async (req, res) => {
  const db = dbHelper.getDb();
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'comment not found' });
    }
    const user = await getUser(db, ObjectId(req.params.id));
    return res.status(200).json(fixId(user));
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ error: error.message });
    }
    return res.status(500).json({ error: 'server error' });
  }
};

module.exports = {
  createUserCtl,
  updateUserCtl,
  getUsersCtl,
  getUserCtl,
};
