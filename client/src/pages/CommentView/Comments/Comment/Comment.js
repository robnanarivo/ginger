import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { deleteComment } from '../../../../api/commentAPI';
import EditComment from './EditComment';

const Comment = (props) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const {
    content,
    timeStamp,
    userId,
    id,
    parentPostId,
    updatePost,
    userName,
    profilePicture,
    admins,
  } = props;
  const date = new Date(timeStamp);
  const dateString = date.toLocaleString();
  const handleDelete = async () => {
    await deleteComment(id, parentPostId);
    updatePost();
  };
  const viewProfile = () => {
    history.push(`/user/${userId}`);
  };
  return (
    <Card sx={{ maxWidth: 800 }}>
      <CardHeader
        avatar={
          profilePicture !== ''
            ? (
              <Avatar src={profilePicture} sx={{ bgcolor: red[500], '&:hover': { cursor: 'pointer' } }} onClick={viewProfile} />
            )
            : (
              <Avatar sx={{ bgcolor: red[500], '&:hover': { cursor: 'pointer' } }} onClick={viewProfile}>
                {userName.charAt(0)}
              </Avatar>
            )
        }
        title={userName}
        subheader={dateString}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
      >
        {
          admins.includes(sessionStorage.getItem('userId')) || sessionStorage.getItem('userId') === userId
            ? (
              <div>
                <Button
                  sx={{ color: '#A9A9A9', marginLeft: '8px' }}
                  startIcon={<EditIcon />}
                  style={{ textTransform: 'none' }}
                  onClick={() => setOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  sx={{ color: '#A9A9A9' }}
                  startIcon={<DeleteIcon />}
                  style={{ textTransform: 'none' }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <EditComment
                  open={open}
                  commentId={id}
                  handleClose={() => setOpen(false)}
                />
              </div>
            ) : ''
        }

      </CardActions>
    </Card>
  );
};

export default Comment;
