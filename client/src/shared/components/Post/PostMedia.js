import { React } from 'react';
import CardMedia from '@mui/material/CardMedia';
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player';

const PostMedia = ({ content }) => {
  if (content.image) {
    return (
      <CardMedia
        component="img"
        height="194"
        image={content.image}
        alt="postimage"
      />
    );
  }
  if (content.audio) {
    return (
      <ReactAudioPlayer
        src={content.audio}
        controls
      />
    );
  }
  if (content.video) {
    return (
      <ReactPlayer url={content.video} width="550px" controls />
    );
  }
  return '';
};

export default PostMedia;
