function DBError(code, message) {
  this.name = 'DBError';
  if (message) {
    this.message = message;
    this.code = code;
  }
}

const getUser = async (db, email) => {
  const user = await db.collection('users').findOne({ email, isActive: true });
  if (!user) {
    throw new DBError(400, 'invalid email or password');
  }
  return user;
};

module.exports = { getUser };
