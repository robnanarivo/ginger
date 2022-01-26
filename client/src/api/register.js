import axios from 'axios';
import domain from '../constants/profile';

const register = async (user) => {
  try {
    const response = await axios.post(`${domain}/api/users`, user);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { error: 'Cannot connect to server' };
  }
};

export default register;
