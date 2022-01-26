import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray(props) {
  const { labels, handleLabelDelete } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {labels.map((label) => (
        <ListItem key={label}>
          <Chip
            label={label}
            variant="outlined"
            color="primary"
            onDelete={() => handleLabelDelete(label)}
          />
        </ListItem>
      ))}
    </Box>
  );
}
