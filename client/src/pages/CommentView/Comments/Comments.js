import React from 'react';
import Stack from '@mui/material/Stack';
import Comment from './Comment';

function generateComments(comments, updatePost, admins) {
  const res = [];
  comments.slice().reverse().forEach((comment) => {
    res.push(<Comment {...comment} updatePost={updatePost} admins={admins} key={comment.id} />);
  });
  return res;
}

const Comments = (props) => {
  const { comments, updatePost, admins } = props;
  // const demo = [
  //   {
  //     body: 'wow the sky so beautiful!!!', avatar: 'L', date: 'September 16, 2021', name: 'Leo',
  //   },
  //   {
  //     body: 'Love your pic~', avatar: 'J', date: 'September 18, 2021', name: 'Jack',
  //   },
  //   {
  //     body: 'Thanks for sharing!', avatar: 'M', date: 'September 21, 2021', name: 'Tommy',
  //   },
  // ];
  return (
    <Stack spacing={2} sx={{ minWidth: '600px' }}>
      {generateComments(comments, updatePost, admins)}
    </Stack>
  );
};

export default Comments;
