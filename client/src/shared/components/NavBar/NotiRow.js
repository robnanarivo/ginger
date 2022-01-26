import * as React from 'react';
import {
  Collapse, Paper, IconButton, Button, ButtonGroup, Box, Container, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { updateNotification, updateGroup } from '../../../api';

const NotiRow = (props) => {
  const [read, setRead] = React.useState(false);
  const [error, setError] = React.useState('');
  const { noti } = props;

  const handleClick = async () => {
    setRead(true);
    await updateNotification(sessionStorage.getItem('userToken'), noti.notificationId);
  };

  const handleApproveJoin = async () => {
    const isSuccess = await updateGroup(noti.params.groupId, 'join', [noti.params.userId], []);
    if (!isSuccess) {
      setError('Failed to approve');
      return;
    }
    setError('');
    await handleClick();
  };

  const handleRejectJoin = async () => {
    const isSuccess = await updateGroup(noti.params.groupId, 'leave', [noti.params.userId], []);
    if (!isSuccess) {
      setError('Failed to reject');
      return;
    }
    setError('');
    await handleClick();
  };

  switch (noti.type) {
    case 'APPLY':
      return (
        <Collapse in={!read}>
          {error && <Alert severity="error">{error}</Alert>}
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
                {noti.content}
              </Container>
              <ButtonGroup
                size="small"
                variant="outlined"
                aria-label="outlined button group"
                color="info"
              >
                <Button
                  onClick={handleApproveJoin}
                >
                  APPROVE
                </Button>
                <Button
                  onClick={handleRejectJoin}
                >
                  REJECT
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>
        </Collapse>
      );
    case 'MENTION':
      return (
        <Collapse in={!read}>
          {error && <Alert severity="error">{error}</Alert>}
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
                {noti.content}
              </Container>
              <ButtonGroup
                size="small"
                variant="outlined"
                aria-label="outlined button group"
                color="info"
              >
                <Button
                  onClick={handleClick}
                  component={Link}
                  to={`/groupboard/${noti.params.groupId}/${noti.params.postId}`}
                >
                  LINK
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>
        </Collapse>
      );
    default:
      return (
        <Collapse in={!read}>
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
                {noti.content}
              </Container>
              <IconButton onClick={handleClick}>
                <CloseIcon
                  fontSize="small"
                />
              </IconButton>
            </Box>
          </Paper>
        </Collapse>
      );
  }
};

export default NotiRow;
