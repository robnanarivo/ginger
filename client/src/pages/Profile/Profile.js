import { React, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Typography, Paper, Box, Avatar, Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UpdateProfile from './UpdateProfile';
import { getProfile } from '../../api/profileAPI';
import domain from '../../constants/profile';

const mediaURL = `${domain}/api/multimedia/`;

const Profile = ({ openChat }) => {
  const { userId } = useParams();
  const history = useHistory();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [userData, setUserData] = useState({
    userName: '',
    profilePicture: '',
  });
  const [registrationDate, setRegistrationDate] = useState(new Date(0));

  // fetch user data
  const fetchData = async () => {
    const token = sessionStorage.getItem('userToken');
    const data = await getProfile(userId, token);
    if (data.status === 401 || data.status === 403) {
      history.push('/login');
      return null;
    }
    return data;
  };
  useEffect(async () => {
    const data = await fetchData();
    setUserData(data);
    const regDate = new Date(data.registrationDate);
    setRegistrationDate(regDate);
  }, []);

  const toggleChat = () => {
    // console.log('chatting');
    openChat(userData.userName, userData.userId);
  };

  const toggleUpdate = () => {
    // console.log('updating profile');
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: '#F4F3F5',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 300,
            height: 350,
          },
        }}
      >
        <Paper elevation={3}>
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                margin: 3,
              }}
            >
              {
                userData.profilePicture === ''
                  ? <Avatar sx={{ width: 100, height: 100 }}>{userData.userName.charAt(0)}</Avatar>
                  : <Avatar sx={{ width: 100, height: 100 }} src={`${mediaURL}${userData.profilePicture}`} />
              }
            </Box>
            <Typography>{userData.userName}</Typography>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              Member since
              {' '}
              {registrationDate.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
              })}
            </Typography>
            <Box
              sx={{
                '& > :not(style)': {
                  width: 200,
                },
              }}
            >
              {userData.userId === sessionStorage.getItem('userId')
                ? (
                  <Button
                    type="button"
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={toggleUpdate}
                  >
                    Update
                  </Button>
                )
                : (
                  <Button
                    type="button"
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={<SendIcon />}
                    onClick={toggleChat}
                  >
                    Chat
                  </Button>
                )}
            </Box>
          </Box>
        </Paper>
        <UpdateProfile open={openUpdate} onClose={handleCloseUpdate} />
      </Box>
    </Box>
  );
};

export default Profile;
