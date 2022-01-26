import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  ButtonGroup,
  Alert,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PermCameraMicOutlinedIcon from '@mui/icons-material/PermCameraMicOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import GroupDropdown from './GroupDropdown';
import FileChip from './FileChip';
import { getListOfGroups } from '../../api';
import upload from '../../api/multimediaAPI';
import { createPost } from '../../api/postAPI';

const CreatePost = () => {
  const history = useHistory();
  const maxSize = 50 * 1024 * 1024;
  const currentGroup = window.location.href.split('/')[4];
  const [groups, setGroups] = useState([]);
  const [file, setFile] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(async () => {
    const data = await getListOfGroups('joined');
    const myGroups = data.map((group) => ({ name: group.groupName, id: group.groupId }));
    setGroups(myGroups);
  }, []);

  const handleImage = () => {
    document.getElementById('uploadImage').click();
  };

  const uploadImage = () => {
    const input = document.querySelector('#uploadImage');
    const myFile = {
      type: 'image',
      file: input.files[0],
    };
    setFile(myFile);
  };

  const handleAudio = () => {
    document.getElementById('uploadAudio').click();
  };

  const uploadAudio = () => {
    const input = document.querySelector('#uploadAudio');
    const myFile = {
      type: 'audio',
      file: input.files[0],
    };
    setFile(myFile);
  };

  const handleVideo = () => {
    document.getElementById('uploadVideo').click();
  };

  const uploadVideo = () => {
    const input = document.querySelector('#uploadVideo');
    const myFile = {
      type: 'video',
      file: input.files[0],
    };
    setFile(myFile);
  };

  const handleFileDelete = () => {
    setFile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const creatorId = sessionStorage.getItem('userId');
    const post = {
      creatorId,
      groupId: data.group,
      title: data.title,
      content: {
        text: data.text,
      },
    };
    if (file) {
      if (file.file.size > maxSize) {
        setError(true);
        setErrorMessage('File size exceeds limit');
        return;
      }
      const media = await upload(file.file);
      post.content[file.type] = media.file.id;
    }
    const newPost = await createPost(post);
    if (newPost.status === 413) {
      setError(true);
      setErrorMessage('Content exceeded maximum length');
    } else {
      history.push(`/groupboard/${currentGroup}`);
    }
  };

  const handleCancel = () => {
    setError(false);
    setErrorMessage('');
    history.push(`/groupboard/${currentGroup}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: '#F4F3F5',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          mt: 10, bgcolor: '#FFFFFF', borderRadius: 2, width: 1000, height: 700,
        }}
      >
        <Box sx={{ mx: 4 }}>
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>Create a Post</Typography>

          {
            error
              ? <Alert severity="error">{errorMessage}</Alert>
              : ''
          }

          <GroupDropdown defaultGroup={currentGroup} groupList={groups} />

          <TextField
            label="Title"
            name="title"
            variant="outlined"
            fullWidth
            required
            sx={{ mt: 1, mb: 1 }}
          />

          <ButtonGroup sx={{ mt: 1, mb: 1 }} variant="outlined" aria-label="outlined button group">
            <Button onClick={handleImage}>
              <ImageOutlinedIcon />
              <input type="file" id="uploadImage" name="picture" accept="image/*" onChange={uploadImage} hidden />
            </Button>
            <Button onClick={handleAudio}>
              <PermCameraMicOutlinedIcon />
              <input type="file" id="uploadAudio" name="audio" accept="audio/*" onChange={uploadAudio} hidden />
            </Button>
            <Button onClick={handleVideo}>
              <VideoLibraryOutlinedIcon />
              <input type="file" id="uploadVideo" name="video" accept="video/*" onChange={uploadVideo} hidden />
            </Button>
          </ButtonGroup>

          {
            file
              ? <FileChip file={file} onDelete={handleFileDelete} />
              : ''
          }

          <TextField
            label="Content"
            name="text"
            variant="outlined"
            multiline
            rows={8}
            fullWidth
            required
            sx={{ mt: 1, mb: 1 }}
          />

          <Grid container justifyContent="flex-end" sx={{ mt: 2, mb: 2 }}>
            <Button
              type="button"
              size="large"
              variant="outlined"
              sx={{
                mr: 2, width: 200, color: 'gray', borderColor: 'gray',
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ width: 200 }}
            >
              POST
            </Button>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
