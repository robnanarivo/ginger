import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createComment } from '../../../api/commentAPI';

const CreateComment = (props) => {
  const { updatePost } = props;
  const [content, setContent] = useState('');
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const { postId } = useParams();
  const handleSubmit = async () => {
    if (content !== '') {
      await createComment({ parentPostId: postId, content });
      updatePost();
      setContent('');
    }
  };
  return (
    <Card sx={{ marginBottom: '30px' }}>
      <CardHeader
        subheader="write your comment"
        sx={{ height: '5px' }}
        // subheader={date}
      />
      <CardContent>
        <TextField
          label="Comment"
          name="comment"
          value={content}
          variant="outlined"
          onChange={handleContentChange}
          multiline
          rows={6}
          fullWidth
          required
        />
      </CardContent>
      <Button
        type="submit"
        size="large"
        variant="contained"
        onClick={handleSubmit}
        sx={{ width: 200, marginBottom: '10px', marginLeft: '385px' }}
      >
        COMMENT
      </Button>
    </Card>
  );
};

export default CreateComment;
