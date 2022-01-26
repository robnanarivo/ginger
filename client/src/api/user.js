import axios from 'axios';
import domain from '../constants/profile';

const getUsers = async (token) => {
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.get(`${domain}/api/users`, { headers: config });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { error: 'Cannot connect to server' };
  }
};

export default getUsers;
