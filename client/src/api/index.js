import {
  getListOfGroups,
  getGroupData,
  updateGroup,
  removeAdmin,
  getGroupAdmins,
  createGroup,
} from './fetcher';
import login from './login';
import register from './register';
import { getNotifications, updateNotification } from './notificationAPI';
import getUsers from './user';
import { updateProfile, getProfile } from './profileAPI';
import {
  createComment, deleteComment, updateComment, getPost,
} from './commentAPI';

export {
  getGroupData,
  getListOfGroups,
  updateGroup,
  getGroupAdmins,
  removeAdmin,
  login,
  register,
  createGroup,
  getNotifications,
  updateNotification,
  getUsers,
  updateProfile,
  getProfile,
  createComment,
  deleteComment,
  updateComment,
  getPost,
};
