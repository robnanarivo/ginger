import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { updateGroup } from '../../../../api';

function displayJoinButton(updateUS, userStatus, groupId) {
  if (userStatus === 'joined') {
    return (
      <Button
        variant="outlined"
        sx={{ marginLeft: 5, minWidth: '100px', marginRight: 5 }}
        onClick={() => {
          const res = updateGroup(groupId, 'leave', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('not joined');
          }
        }}
      >
        LEAVE
      </Button>
    );
  }
  if (userStatus === 'pending') {
    return (
      <Button
        variant="contained"
        sx={{
          marginLeft: 5,
          minWidth: '100px',
          marginRight: 5,
          color: '#AFAFAF',
          backgroundColor: '#E0E0E0',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#C0C0C0',
          },
        }}
        onClick={() => {
          const res = updateGroup(groupId, 'leave', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('not joined');
          }
        }}
      >
        PENDING
      </Button>
    );
  }
  if (userStatus === 'not joined') {
    return (
      <Button
        variant="contained"
        sx={{ marginLeft: 5, minWidth: '100px', marginRight: 5 }}
        onClick={() => {
          const res = updateGroup(groupId, 'apply', [sessionStorage.getItem('userId')], []);
          if (res) {
            updateUS('pending');
          }
        }}
      >
        JOIN
      </Button>
    );
  }
  return (<div />);
}

export default function GroupRow(props) {
  const history = useHistory();
  const {
    groupId,
    number,
    groupName,
    groupPic,
    member,
    userStatus,
  } = props;
  const [uS, setUS] = useState(userStatus);
  const updateUS = (us) => {
    setUS(us);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        p: 1,
        height: '60px',
      }}
    >
      <Box
        onClick={() => { history.push(`/groupboard/${groupId}`); }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          p: 1,
          width: '70%',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        data-testid="b1"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            p: 1,
            minWidth: '150px',
          }}
        >
          <Typography sx={{ marginLeft: 5 }}>
            {number}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar>
            {groupPic === ''
              ? (<FolderIcon />)
              : (<Avatar alt="Group Logo" src={groupPic} sx={{ backgroundColor: '#FFFFFF' }} />)}
          </Avatar>
        </Box>
        <Typography sx={{ marginLeft: 5 }}>
          {groupName}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {
          member > 1
            ? (
              <Typography>
                {`${member} Members`}
              </Typography>
            ) : (
              <Typography>
                {`${member} Member`}
              </Typography>
            )
        }

      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {displayJoinButton(updateUS, uS, groupId)}
    </Box>
  );
}
