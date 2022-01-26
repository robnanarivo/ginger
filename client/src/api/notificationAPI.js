import axios from 'axios';
import domain from '../constants/profile';

const getNotifications = async (token) => {
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.get(`${domain}/api/notifications`, { headers: config });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { error: 'Cannot connect to server' };
  }
};

export default getNotifications;

const updateNotification = async (token, notificationId) => {
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.put(`${domain}/api/notifications/${notificationId}`, {}, { headers: config });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { error: 'Cannot connect to server' };
  }
};

export { getNotifications, updateNotification };
