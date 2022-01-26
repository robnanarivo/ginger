import * as React from 'react';
import {
  Stack, Paper, Box, Container,
} from '@mui/material';
import NotiRow from './NotiRow';

const NotiList = (props) => {
  const { notiList } = props;
  if (notiList.length === 0) {
    return (
      <Stack
        direction="column-reverse"
        justifyContent="space-evenly"
        alignItems="stretch"
        spacing={1}
        margin={1}
      >
        <Paper
          variant="outlined"
          elevation={0}
          sx={{
            borderColor: '#0079D3',
          }}
        >
          <Box
            margin="10px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Container>
              You are all caught up!
            </Container>
          </Box>
        </Paper>
      </Stack>
    );
  }
  return (
    <Stack
      direction="column-reverse"
      justifyContent="space-evenly"
      alignItems="stretch"
      spacing={1}
      margin={1}
    >
      {
        notiList.map((noti) => (
          <NotiRow noti={noti} key={noti.notificationId} />
        ))
      }
    </Stack>
  );
};

export default NotiList;
