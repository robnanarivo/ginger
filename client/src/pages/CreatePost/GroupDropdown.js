import { React, useState } from 'react';
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@mui/material';

const GroupDropdown = ({ groupList, defaultGroup }) => {
  const [dropdown, setDropdown] = useState(defaultGroup);

  // post into a chosen group
  const handleChange = (e) => {
    setDropdown(e.target.value);
  };

  return (
    <FormControl sx={{ width: 400, mt: 2, mb: 1 }} required>
      <InputLabel>Group</InputLabel>
      <Select label="Group" name="group" value={dropdown} onChange={handleChange}>
        {groupList.map((group) => (
          <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Select a group to post into</FormHelperText>
    </FormControl>
  );
};

export default GroupDropdown;
