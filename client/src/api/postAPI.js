import axios from 'axios';
import domain from '../constants/profile';

const createPost = async (update) => {
  try {
    const res = await axios.post(`${domain}/api/posts/`, update);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const deletePost = async (postId) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.delete(`${domain}/api/posts/${postId}`, { headers: config });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const getPost = async (postId) => {
  try {
    const res = await axios.get(`${domain}/api/posts/${postId}`);
    const { data } = res;
    const { content, comments } = data;
    if (content.audio) {
      Object.assign(content, { audio: `${domain}/api/multimedia/${content.audio}` });
    }
    if (content.video) {
      Object.assign(content, { video: `${domain}/api/multimedia/${content.video}` });
    }
    if (content.image) {
      Object.assign(content, { image: `${domain}/api/multimedia/${content.image}` });
    }
    comments.forEach((comment) => {
      if (comment.profilePicture !== '') {
        Object.assign(comment, { profilePicture: `${domain}/api/multimedia/${comment.profilePicture}` });
      }
    });
    return data;
  } catch (err) {
    return err.response;
  }
};

const getGroupPosts = async (groupId, offset) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const ret = await axios.get(`${domain}/api/posts/groupPosts?groupId=${groupId}&limit=10&offset=${offset}`, { headers: config });
    const { data } = ret;
    data.forEach((post) => {
      const { content } = post;
      if (content.audio) {
        Object.assign(content, { audio: `${domain}/api/multimedia/${content.audio}` });
      }
      if (content.video) {
        Object.assign(content, { video: `${domain}/api/multimedia/${content.video}` });
      }
      if (content.image) {
        Object.assign(content, { image: `${domain}/api/multimedia/${content.image}` });
      }
    });
    return data;
  } catch (err) {
    return err.response;
  }
};

export {
  createPost,
  deletePost,
  getGroupPosts,
  getPost,
};
