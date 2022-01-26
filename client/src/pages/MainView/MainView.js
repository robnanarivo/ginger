import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import { getListOfGroups } from '../../api';
import TopicBar from './TopicBar';
import GroupList from './GroupList';

const MainView = () => {
  const history = useHistory();
  const [listOfGroups, setListOfGroups] = useState([]);
  const { topic } = useParams();
  useEffect(async () => {
    const res = await getListOfGroups(topic);
    if (!res || (res.data && 'error' in res.data && res.data.error === 'forbidden')) {
      history.push('/login');
      return;
    }
    setListOfGroups(res);
  }, [topic]);

  const updateListOfGroups = async (tp) => {
    const res = await getListOfGroups(tp);
    if (!res || (res.data && 'error' in res.data && res.data.error === 'forbidden')) {
      history.push('/login');
      return;
    }
    setListOfGroups(res);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '50px',
        bgcolor: '#F4F3F5',
        marginTop: '3%',
        minHeight: '100vh',
      }}
    >
      <TopicBar updateListOfGroups={updateListOfGroups} />
      <GroupList listOfGroups={listOfGroups} data-testid="grouplist" />
    </Box>
  );
};

export default MainView;
