import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useParams } from 'react-router-dom';
import AdminRow from './AdminRow';
import AddAdminBar from './AddAdminBar';
import { getGroupData } from '../../api';

function displayAdmins(listOfAdmins, updateAdmins, creatorId) {
  const res = [];
  let count = 0;
  listOfAdmins.forEach((admin) => {
    count += 1;
    res.push(
      <AdminRow
        key={admin.userId}
        adminId={admin.id}
        adminPic={admin.profilePicture}
        adminName={admin.userName}
        updateAdmins={updateAdmins}
        creatorId={creatorId}
      />,
    );
    if (count !== listOfAdmins.length) {
      res.push(<Divider key={`d${count}`} />);
    }
  });
  return res;
}

export default function GroupManage() {
  const { groupId } = useParams();
  const [admins, setAdmins] = useState([]);
  const [groupData, setGroupData] = useState({ users: [], creatorId: '' });
  useEffect(async () => {
    const res = await getGroupData(groupId);
    setAdmins(res.admins);
    setGroupData(res);
  }, []);

  const updateAdmins = async () => {
    const res = await getGroupData(groupId);
    setAdmins(res.admins);
    setGroupData(res);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F4F3F5',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '800px',
          marginTop: '50px',
        }}
      >
        <List
          sx={{
            width: '100%',
            marginTop: 8,
            maxWidth: 720,
            bgcolor: '#FFFFFF',
            alignSelf: 'flex-start',
            marginBottom: 8,
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            (
              <ListSubheader component="div" id="nested-list-subheader" sx={{ bgcolor: '#E5E5E5' }}>
                Group Admin
              </ListSubheader>
            )
          }
        >
          {displayAdmins(admins, updateAdmins, groupData.creatorId)}
        </List>
        <AddAdminBar users={groupData.users} updateAdmins={updateAdmins} admins={admins} />
      </Box>
    </Box>
  );
}
