import React from 'react';
import CardActions from '@mui/material/CardActions';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { getProfile, updateProfile } from '../../../api';

const PostActions = (props) => {
  const {
    postId,
    handleDelete,
    creatorId,
    admins,
  } = props;
  const history = useHistory();
  const { groupId } = useParams();
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('userToken');
  const [flagged, setFlagged] = React.useState(false);
  const [error, setError] = React.useState('');
  // console.log(creatorId, userId, admins);

  const handleFlag = async () => {
    if (flagged) return;
    const profile = await getProfile(userId, token);
    if ('error' in profile) {
      setError(profile.error);
      return;
    }
    const newFlags = [...profile.flags, postId];
    const updatedProfile = await updateProfile(userId, { flags: newFlags }, token);
    if ('error' in updatedProfile) {
      setError(updatedProfile.error);
      return;
    }
    setFlagged(true);
  };

  const handleHide = async () => {
    const profile = await getProfile(userId, token);
    if ('error' in profile) {
      setError(profile.error);
      return;
    }
    const newHides = [...profile.hides, postId];
    const updatedProfile = await updateProfile(userId, { hides: newHides }, token);
    if ('error' in updatedProfile) {
      setError(updatedProfile.error);
      return;
    }
    history.push(`/groupboard/${groupId}`);
  };

  React.useEffect(async () => {
    const profile = await getProfile(userId, token);
    if ('error' in profile) {
      setError(profile.error);
      return;
    }
    if (profile.flags.includes(postId)) {
      setFlagged(true);
    }
  }, []);

  return (
    <CardActions
      disableSpacing
      sx={{
        display: 'flex',
        marginLeft: '6px',
      }}
    >
      <Button
        sx={{ color: '#A9A9A9' }}
        startIcon={<VisibilityOffIcon />}
        style={{ textTransform: 'none' }}
        onClick={handleHide}
      >
        Hide
      </Button>
      <Button
        sx={{ color: flagged ? '#ffa726' : '#A9A9A9' }}
        startIcon={<FlagIcon />}
        style={{ textTransform: 'none' }}
        onClick={handleFlag}
      >
        Flag
      </Button>
      {
        creatorId === userId || admins.includes(userId)
          ? (
            <Button
              sx={{ color: '#A9A9A9' }}
              startIcon={<DeleteIcon />}
              style={{ textTransform: 'none' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          ) : (
            ''
          )
      }

      { error && <Alert severity="error" variant="outlined">{error}</Alert> }
    </CardActions>
  );
};

export default PostActions;
