import React from 'react';
import { Grid, Typography } from '@mui/material';

const style = {
  maxWidth: 350,
  maxHeight: '100%',
};

const ChatImage = ({
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
        <img src={url} alt="" style={style} />
        <Typography sx={{ fontSize: 14, color: 'gray' }}>{timestamp}</Typography>
      </Grid>
    </Grid>
  );
};

export default ChatImage;
