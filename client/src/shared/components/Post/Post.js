import { React } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';

const Post = (props) => {
  const {
    creatorName, creatorId, title, profilePicture,
    timestamp, content, onPostClick, handleDelete, postId, admins,
  } = props;
  const date = new Date(timestamp);
  const dateString = date.toLocaleString();

  return (
    <Card sx={{ maxWidth: 800 }}>
      <PostHeader
        creatorId={creatorId}
        creatorName={creatorName}
        profilePicture={profilePicture}
        dateString={dateString}
      />
      {onPostClick
        ? (
          <CardContent
            onClick={onPostClick}
            sx={{ '&:hover': { cursor: 'pointer' } }}
          >
            <Typography variant="h5" color="text.primary">
              {title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PostMedia content={content} />
            </Box>
          </CardContent>
        )
        : (
          <div>
            <CardContent>
              <Typography variant="h5" color="text.primary">
                {title}
              </Typography>
              <Typography variant="h7" color="text.primary">
                {content.text}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PostMedia content={content} />
              </Box>
            </CardContent>
            <PostActions
              handleDelete={handleDelete}
              postId={postId}
              admins={admins}
              creatorId={creatorId}
            />
          </div>
        )}
    </Card>
  );
};

export default Post;
