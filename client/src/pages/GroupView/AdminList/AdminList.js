import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function generate(admins) {
  const result = [];
  const history = useHistory();
  admins.forEach((admin) => {
    result.push(
      <ListItem key={admin.userName}>
        <ListItemText
          primary={admin.userName}
          sx={{
            color: '#017DD7',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={() => {
            history.push(`/user/${admin.id}`);
          }}

        />
      </ListItem>,
    );
  });
  return result;
}

export default function AdminList(props) {
  const { admins } = props;
  // console.log(admins);
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        width: '300px',
        marginTop: '50px',
      }}
    >
      <Typography variant="h5" sx={{ marginLeft: '8%' }}> Admins </Typography>
      <Divider sx={{ backgroundColor: 'black' }} />
      <List dense>
        {generate(admins)}
      </List>
    </Box>
  );
}
