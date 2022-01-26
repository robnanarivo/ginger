import React from 'react';
import {
  Paper,
  Grid,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MessageArea from './MessageArea';
import SendArea from './SendArea';

const Chat = ({ chatter, chatterId, onClose }) => (
  <div>
    <Grid
      container
      component={Paper}
      elevation={3}
      sx={{
        width: 600,
        height: 500,
        position: 'absolute',
        bottom: 5,
        right: 15,
        borderRadius: 5,
      }}
    >

      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center" sx={{ height: 50, width: '100%' }}>
          <Grid item xs={11}>
            <Typography sx={{ fontSize: 24, textAlign: 'center' }}>{chatter}</Typography>
          </Grid>
          <Grid item xs={1} align="right">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Divider variant="middle" />
        <MessageArea chatter={chatter} chatterId={chatterId} />

        <Divider variant="middle" />
        <Grid container alignItems="center" justifyContent="center" sx={{ height: 80 }}>
          <SendArea chatterId={chatterId} />
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default Chat;
