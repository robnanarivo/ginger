const isEmailValid = (email) => {
  const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(String(email).toLowerCase());
};

const isPasswordValid = (password) => {
  const re = /^[0-9a-zA-Z]{8,}$/;
  return re.test(String(password));
};

export { isEmailValid, isPasswordValid };
