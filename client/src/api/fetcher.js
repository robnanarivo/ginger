// import { groupData, listOfGroupAll, listOfGroupPub } from './mockFetch';
import axios from 'axios';
import { listOfAdmins } from './mockFetch';

const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : '';

const getGroupData = async (groupId) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const ret = await axios.get(`${domain}/api/group/${groupId}`, { headers: config });
    const { data } = ret;
    if (data.groupIcon !== '') {
      Object.assign(data, { groupIcon: `${domain}/api/multimedia/${data.groupIcon}` });
    } else {
      Object.assign(data, { groupIcon: '' });
    }
    // data.posts.forEach((post) => {
    //   const { content } = post;
    //   if (content.audio) {
    //     Object.assign(content, { audio: `${domain}/api/multimedia/${content.audio}` });
    //   }
    //   if (content.video) {
    //     Object.assign(content, { video: `${domain}/api/multimedia/${content.video}` });
    //   }
    //   if (content.image) {
    //     Object.assign(content, { image: `${domain}/api/multimedia/${content.image}` });
    //   }
    // });
    return data;
  } catch (err) {
    return err.response;
  }
};

const createGroup = async (groupInfo) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.post(`${domain}/api/group/`, groupInfo, { headers: config });
    return res.data;
  } catch (err) {
    // console.log(err);
    return err.response.data;
  }
};

const updateGroup = async (groupId, action, userIds, adminIds) => {
  const token = sessionStorage.getItem('userToken');
  const updateInfo = { action, userIds, adminIds };
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const res = await axios.put(`${domain}/api/group/${groupId}`, updateInfo, { headers: config });
    // console.log(res);
    if (res.data.results === 'success') {
      return true;
    }
    return false;
  } catch (err) {
    // console.log(err);
    return false;
  }
};

const getListOfGroups = async (topic) => {
  const token = sessionStorage.getItem('userToken');
  try {
    const config = {
      authorization: `Bearer ${token}`,
    };
    const ret = await axios.get(`${domain}/api/groups/${topic}`, { headers: config });
    const { data } = ret;
    data.forEach((d) => {
      if (d.groupIcon !== '') {
        Object.assign(d, { groupIcon: `${domain}/api/multimedia/${d.groupIcon}` });
      } else {
        Object.assign(d, { groupIcon: '' });
      }
    });
    return ret.data;
  } catch (err) {
    // console.log(err.response);
    return err.response;
  }
};

// const getGroupAdmins = async (groupId) => {
//   const groupInfo = ['Alex', 'Tom'];
//   if (groupId) {
//     return listOfAdmins;
//   }
//   // const token = sessionStorage.getItem('userToken');
//   // try {
//   //   const config = {
//   //     authorization: `Bearer ${token}`,
//   //   };
//   //   const ret = await axios.get(`${domain}/api/group/${groupId}`, { headers: config });
//   //   const { data } = ret;
//   //   console.log(data);
//   // } catch (err) {
//   //   return err.response;
//   // }
//   return groupInfo;
// };

const getGroupAdmins = async (groupId) => {
  const groupInfo = ['Alex', 'Tom'];
  if (groupId) {
    return listOfAdmins;
  }
  // const token = sessionStorage.getItem('userToken');
  // try {
  //   const config = {
  //     authorization: `Bearer ${token}`,
  //   };
  //   const ret = await axios.get(`${domain}/api/group/${groupId}`, { headers: config });
  //   const { data } = ret;
  //   console.log(data);
  // } catch (err) {
  //   return err.response;
  // }
  return groupInfo;
};

const removeAdmin = async (adminId) => {
  if (!adminId) {
    return true;
  }
  return true;
};

export {
  getGroupData,
  getListOfGroups,
  createGroup,
  updateGroup,
  getGroupAdmins,
  removeAdmin,
};
