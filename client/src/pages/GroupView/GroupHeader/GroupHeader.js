import React from 'react';
import Avatar from '@mui/material/Avatar';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { updateGroup } from '../../../api';

function displayJoinButton(updateUS, userStatus, groupId) {
  if (userStatus === 'not join') {
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
            updateUS('not join');
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
  if (userStatus === 'joined') {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          const res = updateGroup(groupId, 'leave', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('not join');
          }
        }}
        sx={{
          width: 120,
          height: 30,
          borderRadius: 8,
          fontWeight: 'bold',
        }}
      >
        LEAVE
      </Button>
    );
  }
  return (<div />);
}

export default function GroupHeader(props) {
  const {
    groupName,
    creatorId,
    groupPic,
    userStatus,
    updateUserStatus,
  } = props;
  const { groupId } = useParams();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        bgcolor: '#FFFFFF',
        height: '120px',
        marginTop: '30px',
        marginBottom: '30px',
      }}
    >
      { groupPic === ''
        ? (<Avatar alt="Group Logo" src="" sx={{ width: 90, height: 90, marginLeft: 20 }} />)
        : (<Avatar alt="Group Logo" src={groupPic} sx={{ width: 90, height: 90, marginLeft: 20 }} />)}

      <Typography
        variant="h4"
        sx={{
          fontSize: 25,
          fontWeight: 'bold',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        {groupName}
      </Typography>
      { creatorId !== sessionStorage.getItem('userId')
        ? displayJoinButton(updateUserStatus, userStatus, groupId)
        : (<div />)}
    </Box>
  );
}
