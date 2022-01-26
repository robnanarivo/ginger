import axios from 'axios';
import domain from '../constants/profile';

const updateProfile = async (userId, update, token) => {
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.put(`${domain}/api/users/${userId}`, update, { headers: config });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const getProfile = async (userId, token) => {
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.get(`${domain}/api/users/${userId}`, { headers: config });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export {
  updateProfile,
  getProfile,
};
