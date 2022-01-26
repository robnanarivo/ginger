import { React, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import { isPasswordValid } from '../../shared/utils';
import { updateProfile } from '../../api/profileAPI';
import upload from '../../api/multimediaAPI';

const UpdateProfile = ({ open, onClose }) => {
  const [error, setError] = useState(false);
  const [notMatch, setNotMatch] = useState(false);
  const [notValid, setNotValid] = useState(false);
  const [image, setImage] = useState();

  const history = useHistory();

  const handleCancel = () => {
    setError(false);
    setNotValid(false);
    setNotMatch(false);
    setImage();
    onClose();
  };

  const handleDeactivate = () => {
    const token = sessionStorage.getItem('userToken');
    const userId = sessionStorage.getItem('userId');
    updateProfile(userId, { isActive: false }, token);
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userId');
    handleCancel();
    history.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // do not submit if there is no new input
    if (data.newPassword === '' && data.confirmPassword === '' && data.newUserName === '' && image === undefined) {
      return;
    }

    setNotMatch(false);
    setNotValid(false);

    if (data.newPassword !== '' || data.confirmPassword !== '') {
      if (data.newPassword !== data.confirmPassword) {
        setError(true);
        setNotMatch(true);
        return;
      }
      if (!isPasswordValid(data.newPassword)) {
        setError(true);
        setNotValid(true);
        return;
      }
    }
    const update = {};
    if (data.newUserName !== '') {
      update.userName = data.newUserName;
    }
    if (data.newPassword !== '') {
      update.password = data.newPassword;
    }
    if (image !== undefined) {
      const uploadedImage = await upload(image);
      update.profilePicture = uploadedImage.file.id;
    }
    const token = sessionStorage.getItem('userToken');
    const userId = sessionStorage.getItem('userId');
    updateProfile(userId, update, token);
    handleCancel();
  };

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ width: 400 }}
      >
        <DialogTitle>Update Personal Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            name="newUserName"
            label="New User Name"
            type="text"
            fullWidth
            variant="outlined"
          />

          <Dropzone
            onDrop={handleDrop}
            accept="image/*"
            minSize={1024}
            maxSize={3072000}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
            }) => {
              if (image === undefined) {
                return (
                  <div
                    id="dropzone"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <span>{isDragActive ? <UploadFileRoundedIcon /> : <InsertPhotoIcon />}</span>
                    <p>Drag & drop your profile picture here</p>
                  </div>
                );
              }
              return (
                <div
                  id="dropzone"
                >
                  <p>
                    {image.name}
                    {' '}
                    selected
                  </p>
                </div>
              );
            }}
          </Dropzone>

          <TextField
            margin="normal"
            name="newPassword"
            label="New Password"
            type="password"
            error={error}
            helperText={notValid ? 'Password is not valid' : ' '}
            fullWidth
            variant="outlined"
          />

          <TextField
            margin="normal"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            error={error}
            helperText={notMatch ? 'Password does not match' : ' '}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ mb: 2 }}>
          <Button
            onClick={handleDeactivate}
            variant="outlined"
            color="error"
          >
            Deactivate
          </Button>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              color: 'gray', borderColor: 'gray',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UpdateProfile;
