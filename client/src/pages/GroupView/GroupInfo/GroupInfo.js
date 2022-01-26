import React from 'react';
import Box from '@mui/material/Box';
import { useHistory, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TopicList from './TopicList';
import Stats from './Stats';
import { updateGroup } from '../../../api';

function displayJoinButton(updateUS, userStatus, groupId) {
  if (userStatus === 'not joined') {
    return (
      <Button
        variant="contained"
        onClick={() => {
          const res = updateGroup(groupId, 'apply', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('pending');
          }
        }}
        sx={{
          width: 120,
          height: 30,
          borderRadius: 8,
          fontWeight: 'bold',
        }}
      >
        JOIN
      </Button>
    );
  }
  if (userStatus === 'pending') {
    return (
      <Button
        variant="contained"
        onClick={() => {
          const res = updateGroup(groupId, 'leave', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('not joined');
          }
        }}
        sx={{
          width: 120,
          height: 30,
          borderRadius: 8,
          fontWeight: 'bold',
          color: '#AFAFAF',
          backgroundColor: '#E0E0E0',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#C0C0C0',
          },
        }}
      >
        PENDING
      </Button>
    );
  }
  return (<div />);
}

export default function GroupInfo(props) {
  const {
    topics,
    groupInfo,
    userStatus,
    updateUserStatus,
    inviteUserPop,
    isAdmin,
  } = props;
  const history = useHistory();
  const { groupId } = useParams();
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        width: '300px',
      }}
    >
      <Typography variant="h5" sx={{ marginLeft: '8%' }}> About </Typography>
      <Divider sx={{ backgroundColor: 'black' }} />
      <Box sx={{ marginLeft: '8%', marginTop: '4%' }}>
        <Typography variant="h6"> Topics </Typography>
        <TopicList topics={topics} sx={{ width: '80%' }} />
        <Typography variant="h6" sx={{ marginTop: '8%' }}> Statistics </Typography>
        <Stats groupInfo={groupInfo} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '8%',
          height: 60,
        }}
      >
        { (userStatus !== 'joined')
          ? displayJoinButton(updateUserStatus, userStatus, groupId)
          : (
            <Button
              variant="contained"
              onClick={inviteUserPop}
              sx={{
                width: 120,
                height: 30,
                borderRadius: 8,
                fontWeight: 'bold',
              }}
            >
              INVITE
            </Button>
          )}
        <Box sx={{ marginLeft: 1, marginRight: 2 }} />
        {
          isAdmin && userStatus === 'joined'
            ? (
              <Button
                variant="contained"
                onClick={() => history.push(`${history.location.pathname}/adminPanel`)}
                sx={{
                  width: 120,
                  height: 30,
                  borderRadius: 8,
                  fontWeight: 'bold',
                }}
              >
                Manage
              </Button>
            )
            : (
              <div />
            )
        }
      </Box>
    </Box>
  );
}
