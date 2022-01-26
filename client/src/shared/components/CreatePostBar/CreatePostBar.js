import React from 'react';
import Box from '@mui/material/Box';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import { useHistory } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function CreatePostBar() {
  const history = useHistory();
  return (
    <Box
      sx={{
        height: '50px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <CreateIcon />
      <Box
        sx={{
          height: '80%',
          width: '70%',
          backgroundColor: alpha('#E5E5E5', 0.6),
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => { history.push(`${history.location.pathname}/createpost`); }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <Typography sx={{ color: '#A9A9A9', borderRadius: 2 }}> Create Post</Typography>
        <Box sx={{ flexGrow: 15 }} />
      </Box>
      <ImageIcon />
      <AttachFileIcon />
    </Box>
  );
}
