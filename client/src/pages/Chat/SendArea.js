import { React, useState } from 'react';
import {
  Divider,
  IconButton,
  InputBase,
  Box,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PermCameraMicOutlinedIcon from '@mui/icons-material/PermCameraMicOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import SendIcon from '@mui/icons-material/Send';
import { sendMessage } from '../../api/messageAPI';
import upload from '../../api/multimediaAPI';

const SendArea = ({ chatterId }) => {
  const sender = sessionStorage.getItem('userId');

  const [textMessage, setTextMessage] = useState('');

  const onInput = (e) => {
    setTextMessage(e.target.value);
  };

  const handleText = () => {
    const toSend = {
      sender,
      recipient: chatterId,
      message: {
        contentType: 'text',
        content: textMessage,
      },
    };
    sendMessage(toSend);

    // clean up text field
    document.getElementById('message').value = '';
    setTextMessage('');
  };

  const handleImage = () => {
    document.getElementById('uploadImage').click();
  };

  const uploadImage = async () => {
    const input = document.querySelector('#uploadImage');
    const file = input.files[0];
    const uploadedFile = await upload(file);
    const toSend = {
      sender,
      recipient: chatterId,
      message: {
        contentType: 'image',
        content: uploadedFile.file.id,
      },
    };
    sendMessage(toSend);
  };

  const handleAudio = () => {
    document.getElementById('uploadAudio').click();
  };

  const uploadAudio = async () => {
    const input = document.querySelector('#uploadAudio');
    const file = input.files[0];
    const uploadedFile = await upload(file);
    const toSend = {
      sender,
      recipient: chatterId,
      message: {
        contentType: 'audio',
        content: uploadedFile.file.id,
      },
    };
    sendMessage(toSend);
  };

  const handleVideo = () => {
    document.getElementById('uploadVideo').click();
  };

  const uploadVideo = async () => {
    const input = document.querySelector('#uploadVideo');
    const file = input.files[0];
    const uploadedFile = await upload(file);
    const toSend = {
      sender,
      recipient: chatterId,
      message: {
        contentType: 'video',
        content: uploadedFile.file.id,
      },
    };
    sendMessage(toSend);
  };

  return (
    <Box
      sx={{
        p: '2px 4px', display: 'flex', alignItems: 'center', width: 500, border: 1, borderColor: '#e0e0e0', borderRadius: 1,
      }}
    >
      <InputBase
        id="message"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Message"
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={onInput}
      />

      <IconButton id="ImageButton" sx={{ p: '10px' }} onClick={handleImage}>
        <ImageOutlinedIcon />
        <input type="file" id="uploadImage" name="image" accept="image/*" onChange={uploadImage} hidden />
      </IconButton>

      <IconButton id="AudioButton" sx={{ p: '10px' }} onClick={handleAudio}>
        <PermCameraMicOutlinedIcon />
        <input type="file" id="uploadAudio" name="audio" accept="audio/*" onChange={uploadAudio} hidden />
      </IconButton>

      <IconButton id="VideoButton" sx={{ p: '10px' }} onClick={handleVideo}>
        <VideoLibraryOutlinedIcon />
        <input type="file" id="uploadVideo" name="video" accept="video/*" onChange={uploadVideo} hidden />
      </IconButton>

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <IconButton id="send" type="button" color="primary" sx={{ p: '10px' }} onClick={handleText}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default SendArea;
