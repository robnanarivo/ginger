import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { updateGroup } from '../../../api';

export default function AddAdminBar(props) {
  const { users, updateAdmins, admins } = props;
  const { groupId } = useParams();
  const [selectedOption, setSelectedOption] = useState({ userName: '' });
  const adminsName = [];
  admins.forEach((admin) => { adminsName.push(admin.userName); });
  const handleChange = (event, value) => {
    setSelectedOption(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FFFFFF',
        maxWidth: 720,
        height: 90,
      }}
    >
      <Autocomplete
        freeSolo
        id="free-solo"
        sx={{ width: '600px', marginLeft: 3 }}
        disableClearable
        key={admins}
        options={users.filter((user) => !adminsName.includes(user.userName))}
        onChange={handleChange}
        getOptionLabel={(option) => option.userName}
        renderInput={(params) => (
          <TextField
            {...params}
            label="User Name"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
      <Button
        variant="contained"
        sx={{ marginLeft: 5, marginRight: 5, minWidth: '100px' }}
        onClick={async () => {
          if (selectedOption.id) {
            await updateGroup(groupId, 'join', [], [selectedOption.id]);
            await updateAdmins();
          }
        }}
      >
        ADD
      </Button>
    </Box>
  );
}
