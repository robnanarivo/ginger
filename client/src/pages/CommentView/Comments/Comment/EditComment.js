import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { updateComment } from '../../../../api';

const EditComment = (props) => {
  const { open, commentId, handleClose } = props;
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState('');

  const handleCancel = () => {
    setError('');
    setContent('');
    handleClose();
  };

  const handleSubmit = async () => {
    const res = await updateComment(commentId, { content });
    if ('error' in res) {
      setError(res.error);
    } else {
      handleCancel();
      window.location.reload(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update your comment.
          </DialogContentText>
          {
            error && (<Alert severity="error">{error}</Alert>)
          }
          <TextField
            onChange={(e) => setContent(e.target.value)}
            autoFocus
            margin="normal"
            id="comment"
            label="Comment Content"
            type="text"
            fullWidth
            variant="outlined"
            value={content}
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditComment;
