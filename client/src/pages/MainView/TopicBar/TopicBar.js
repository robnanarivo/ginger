import React from 'react';
import { alpha } from '@mui/material/styles';
import { useHistory, useParams } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function displayTopics(listOfTopics, chosenTopic, updateListOfGroups) {
  const history = useHistory();
  const res = [];
  listOfTopics.forEach((topic) => {
    res.push(
      (topic.toLowerCase() === chosenTopic)
        ? (
          <ListItemButton
            key={topic}
            onClick={() => { history.push(`/${topic.toLowerCase()}`); updateListOfGroups(topic.toLowerCase()); }}
            sx={{ bgcolor: alpha('#E5E5E5', 0.3) }}
          >
            <ListItemText primary={topic.replace('_', ' ')} />
          </ListItemButton>
        )
        : (
          <ListItemButton
            key={topic}
            onClick={() => { history.push(`/${topic.toLowerCase()}`); updateListOfGroups(topic.toLowerCase()); }}
          >
            <ListItemText primary={topic.replace('_', ' ')} />
          </ListItemButton>
        )
      ,
    );
  });
  return res;
}

export default function TopicBar(props) {
  const { updateListOfGroups } = props;
  const { topic } = useParams();
  const listOfTopics = ['Joined', 'Suggestions', 'Public', 'Private', 'Local', 'Food', 'Entertainment', 'Sports'];
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 280,
        bgcolor: '#FFFFFF',
        maxHeight: 430,
        m: 8,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        (
          <ListSubheader component="div" id="nested-list-subheader" sx={{ bgcolor: '#E5E5E5' }}>
            Topics
          </ListSubheader>
        )
      }
    >
      {displayTopics(listOfTopics, topic, updateListOfGroups)}
    </List>
  );
}
