// import React from 'react';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Post } from '../../shared/components';
import Comments from './Comments';
import CreateComment from './CreateComment';
import { getPost, deletePost } from '../../api/postAPI';
// import postData from '../../api/mockPosts';

const CommentView = () => {
  const { postId, groupId } = useParams();
  const history = useHistory();
  const [post, setPost] = useState({
    postId: '',
    creatorName: 'a',
    creatorId: '',
    title: '',
    profilePicture: '',
    admins: [],
    content: {},
    timestamp: 0,
    comments: [],
  });

  const updatePost = async () => {
    const res = await getPost(postId);
    setPost(res);
  };

  useEffect(async () => {
    const res = await getPost(postId);
    setPost(res);
  }, []);

  // const post = posts[0];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        bgcolor: '#F4F3F5',
        marginTop: '3%',
        minHeight: '100vh',
      }}
    >
      <Box style={{ marginTop: '40px', minWidth: '600px' }}>
        <Post
          key={post.postId}
          creatorName={post.creatorName}
          creatorId={post.creatorId}
          title={post.title}
          profilePicture={post.profilePicture}
          content={post.content}
          timestamp={post.timestamp}
          admins={post.admins}
          handleDelete={async () => {
            await deletePost(post.postId);
            history.push(`/groupBoard/${groupId}`);
          }}
          postId={post.postId}
        />
      </Box>
      <Box style={{ minWidth: '600px' }}>
        <CreateComment updatePost={updatePost} />
        <Comments
          comments={post.comments}
          key={post}
          updatePost={updatePost}
          admins={post.admins}
        />
      </Box>
    </Box>
  );
};

export default CommentView;
