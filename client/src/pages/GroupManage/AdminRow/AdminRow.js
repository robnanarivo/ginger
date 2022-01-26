import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// import FolderIcon from '@mui/icons-material/Folder';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { updateGroup } from '../../../api';

export default function AdminRow(props) {
  const {
    adminId,
    adminPic,
    adminName,
    creatorId,
    updateAdmins,
  } = props;
  const { groupId } = useParams();
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
      <Avatar sx={{ marginLeft: 3 }}>
        {adminPic === ''
          ? (<Avatar alt="Admin Pic" src="" />)
          : (<Avatar alt="Admin Pic" src={adminPic} sx={{ backgroundColor: '#FFFFFF' }} />)}
      </Avatar>
      <Typography sx={{ marginLeft: 5 }}>
        {adminName}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {
        creatorId !== adminId
          ? (
            <Button
              variant="outlined"
              sx={{ marginLeft: 5, minWidth: '100px', marginRight: 5 }}
              onClick={async () => {
                await updateGroup(groupId, 'leave', [], [adminId]);
                updateAdmins();
              }}
            >
              REMOVE
            </Button>
          )
          : (
            <div />
          )
      }

    </Box>
  );
}
