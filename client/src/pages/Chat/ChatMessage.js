import React from 'react';
import { Grid, Typography } from '@mui/material';

const ChatMessage = ({
  chatter,
  content,
  timestamp,
  isSelf,
}) => {
  let align = 'left';
  let sender = chatter;
  if (isSelf) {
    align = 'right';
    sender = 'You';
  }
  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item xs={12} align={align}>
        <Typography sx={{ fontSize: 14, color: 'gray' }}>{sender}</Typography>
        <Typography sx={{ fontSize: 18 }}>{content}</Typography>
        <Typography sx={{ fontSize: 14, color: 'gray' }}>{timestamp}</Typography>
      </Grid>
    </Grid>
  );
};

export default ChatMessage;
