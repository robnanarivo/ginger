import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import SearchIcon from '@mui/icons-material/Search';
import { getNotifications } from '../../../api';
import NotiList from './NotiList';

import { Search, SearchIconWrapper, StyledInputBase } from './style';

export default function NavBar(props) {
  const { createGroupPop, openNavBar } = props;
  const history = useHistory();

  // notification popover button handler
  const [notifications, setNotifications] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      history.push(`/${e.target.value}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userId');
    openNavBar(false);
    history.push('/login');
  };
  const userId = sessionStorage.getItem('userId');

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getNotifications(sessionStorage.getItem('userToken'));
      if ('error' in response) {
        return;
      }
      setNotifications(response);
    }, 5000); // update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  React.useEffect(async () => {
    const response = await getNotifications(sessionStorage.getItem('userToken'));
    if ('error' in response) {
      return;
    }
    setNotifications(response);
  }, [open]);

  return (
    <AppBar sx={{ bgcolor: '#FFFFFF', height: '50px', justifyContent: 'center' }}>
      <Toolbar>
        <img alt="logo" style={{ height: '60%', width: 'auto', marginRight: '20px' }} src="/Ginger.png" />
        <Typography
          onClick={() => history.push('/public')}
          variant="h5"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block', color: 'black' }, '&:hover': { cursor: 'pointer' } }}
        >
          Ginger
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ fill: 'black' }} onClick={handleSearch} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onKeyPress={handleSearch}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton size="large" fill="black" onClick={() => { createGroupPop(); }}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 5 new notifications"
            fill="black"
            onClick={handleClick}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotiList
              notiList={notifications}
            />
          </Popover>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-haspopup="true"
            fill="black"
            onClick={() => history.push(`/user/${userId}`)}
          >
            <AccountCircle />
          </IconButton>
          <IconButton size="large" fill="black" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
