import { React } from 'react';
import { Box, Chip } from '@mui/material';

const FileChip = ({ file, onDelete }) => (
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
    <Chip
      label={file.file.name}
      variant="outlined"
      color="primary"
      onDelete={() => onDelete()}
    />
  </Box>
);

export default FileChip;
