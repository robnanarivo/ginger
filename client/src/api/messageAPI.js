import axios from 'axios';
import domain from '../constants/profile';

const sendMessage = async (message) => {
  try {
    const res = await axios.post(`${domain}/api/messages`, message);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const getMessageHistory = async (chatter1, chatter2, offset) => {
  const params = {
    chatter1,
    chatter2,
    offset,
    limit: 10,
  };
  try {
    const res = await axios.get(`${domain}/api/messages`, { params });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const getNewMessage = async (chatter1, chatter2) => {
  const params = {
    chatter1,
    chatter2,
    offset: 0,
    limit: 1,
  };
  try {
    const res = await axios.get(`${domain}/api/messages`, { params });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export {
  sendMessage,
  getMessageHistory,
  getNewMessage,
};
