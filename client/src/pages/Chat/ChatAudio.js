import React from 'react';
import { Grid, Typography } from '@mui/material';
import ReactAudioPlayer from 'react-audio-player';

const ChatAudio = ({
  sender,
  url,
  timestamp,
  isSelf,
}) => {
  let align = 'left';
  if (isSelf) {
    align = 'right';
  }
  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item xs={12} align={align}>
        <Typography sx={{ fontSize: 14, color: 'gray' }}>{sender}</Typography>
        <ReactAudioPlayer
          src={url}
          controls
        />
        <Typography sx={{ fontSize: 14, color: 'gray' }}>{timestamp}</Typography>
      </Grid>
    </Grid>
  );
};

export default ChatAudio;
