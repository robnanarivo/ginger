import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function TopicList(props) {
  const { groupInfo } = props;
  return (
    <Stack direction="row" spacing={6} sx={{ width: '100%' }}>
      <Box>
        <Typography sx={{ color: '#A9A9A9' }}> Created on</Typography>
        <Typography>
          {groupInfo.createOn}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ color: '#A9A9A9' }}> Members</Typography>
        <Typography>
          {groupInfo.member}
        </Typography>
      </Box>
    </Stack>
  );
}
