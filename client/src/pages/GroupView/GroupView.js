import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import PostContents from './PostContents';
import GroupHeader from './GroupHeader';
import GroupInfo from './GroupInfo';
import AdminList from './AdminList';
import InviteUser from './InviteUser';
import { getGroupData } from '../../api';

export default function GroupView() {
  const { groupId } = useParams();
  const [ivOpen, setIvOpen] = useState(false);
  const [userStatus, setUserStatus] = useState('not join');
  const [groupData, setGroupData] = useState({
    topics: [],
    posts: [],
    groupInfo: { createOn: '', member: '' },
    userStatus: 'not join',
    gropuIcon: '',
    admins: [],
    isAdmin: false,
  });
  useEffect(() => getGroupData(groupId).then((res) => {
    setGroupData(res);
    setUserStatus(res.userStatus);
  }), []);
  const inviteUserPop = () => {
    setIvOpen(!ivOpen);
  };
  const updateUserStatus = (us) => {
    setUserStatus(us);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F4F3F5',
        marginTop: '50px',
        minHeight: '100vh',
      }}
    >
      <InviteUser open={ivOpen} inviteUserPop={inviteUserPop} />
      <GroupHeader
        groupName={groupData.groupName}
        userStatus={userStatus}
        groupPic={groupData.groupIcon}
        creatorId={groupData.creatorId}
        updateUserStatus={updateUserStatus}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <PostContents key={userStatus} userStatus={userStatus} />
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <GroupInfo
            topics={groupData.topics}
            groupInfo={groupData.groupInfo}
            userStatus={userStatus}
            updateUserStatus={updateUserStatus}
            inviteUserPop={inviteUserPop}
            isAdmin={groupData.isAdmin}
          />
          <AdminList admins={groupData.admins} />
          <Box sx={{ flexGrow: 1 }} />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </Box>
  );
}
