import axios from 'axios';
import domain from '../constants/profile';

const createComment = async (comment) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.post(`${domain}/api/comments/`, comment, { headers: config });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const deleteComment = async (commentId) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.delete(`${domain}/api/comments/${commentId}`, { headers: config });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const updateComment = async (commentId, comment) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.put(`${domain}/api/comments/${commentId}`, comment, { headers: config });
    return res.data;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    }
    return { error: 'Cannot connect to server' };
  }
};

const getPost = async (postId) => {
  try {
    const res = await axios.get(`${domain}/api/posts/${postId}`);
    const { data } = res;
    const { content } = data;
    if (content.audio) {
      Object.assign(content, { audio: `${domain}/api/multimedia/${content.audio}` });
    }
    if (content.video) {
      Object.assign(content, { video: `${domain}/api/multimedia/${content.video}` });
    }
    if (content.image) {
      Object.assign(content, { image: `${domain}/api/multimedia/${content.image}` });
    }
    return data;
  } catch (err) {
    return err.response;
  }
};

export {
  createComment,
  deleteComment,
  updateComment,
  getPost,
};
