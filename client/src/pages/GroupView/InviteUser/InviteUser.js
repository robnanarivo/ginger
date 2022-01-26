import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { updateGroup, getUsers } from '../../../api';

const InviteUser = (props) => {
  const { open, inviteUserPop } = props;
  const { groupId } = useParams();
  const [userName, setUserName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleClose = async () => {
    inviteUserPop();
    setUserName('');
    setError('');
  };

  const handleSubmit = async () => {
    const users = await getUsers(sessionStorage.getItem('userToken'));
    if ('error' in users) {
      setError(users.error);
      return;
    }
    const targetUser = users.find((user) => user.userName === userName);
    if (!targetUser) {
      setError('User not found');
      return;
    }
    const targetUserId = targetUser.userId;
    const isSuccess = await updateGroup(groupId, 'apply', [targetUserId], []);
    if (!isSuccess) {
      setError('Cannot invite user');
      return;
    }
    handleClose();
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: '400px',
          }}
          >
            <TextField
              autoFocus
              margin="normal"
              id="addUser"
              label="User Name"
              type="text"
              variant="outlined"
              sx={{ minWidth: '250px' }}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                marginLeft: 5,
                marginRight: 5,
                minWidth: '100px',
              }}
            >
              Add
            </Button>
          </Box>
          {
            error && (<Alert severity="error">{error}</Alert>)
          }
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InviteUser;
