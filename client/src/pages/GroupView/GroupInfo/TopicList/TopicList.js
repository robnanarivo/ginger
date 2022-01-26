import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

function displayTopics(topics) {
  const ret = [];
  topics.forEach((topic) => {
    ret.push(
      <Chip
        label={topic}
        key={topic}
        sx={{
          color: '#017DD7',
          bgcolor: '#EFEFF1',
          marginLeft: '3%',
          marginTop: '3%',
        }}
      />,
    );
  });
  return ret;
}

export default function TopicList(props) {
  const { topics } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {displayTopics(topics)}
    </Box>
  );
}
