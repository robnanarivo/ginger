import { React } from 'react';
import { useHistory } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

const PostHeader = ({
  creatorId,
  creatorName,
  profilePicture,
  dateString,
}) => {
  const history = useHistory();

  const viewProfile = () => {
    history.push(`/user/${creatorId}`);
  };

  return (
    <CardHeader
      avatar={
        profilePicture
          ? (
            <Avatar src={profilePicture} sx={{ bgcolor: red[500], '&:hover': { cursor: 'pointer' } }} onClick={viewProfile} />
          )
          : (
            <Avatar sx={{ bgcolor: red[500], '&:hover': { cursor: 'pointer' } }} onClick={viewProfile}>
              {creatorName.charAt(0)}
            </Avatar>
          )
      }
      title={creatorName}
      subheader={dateString}
    />
  );
};

export default PostHeader;
