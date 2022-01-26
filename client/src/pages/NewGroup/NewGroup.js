import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import {
  FormLabel, FormControl, FormControlLabel, Radio, RadioGroup, Alert,
} from '@mui/material';

import Dropzone from 'react-dropzone';
import ChipsArray from './ChipArray';
import upload from '../../api/multimediaAPI';
import { createGroup } from '../../api';
import './style.css';

const NewGroup = (props) => {
  const { open, createGroupPop } = props;
  const [imageName, setImageName] = React.useState('');
  const [labels, setLabels] = React.useState([]);
  const [error, setError] = React.useState('');
  const [uploadFile, setUpLoadFile] = React.useState('');
  const [groupType, setGroupType] = React.useState('public');

  const handleDrop = (acceptedFiles) => {
    // console.log(acceptedFiles);
    setImageName(acceptedFiles.map((file) => file.name)[0]);
    setUpLoadFile(acceptedFiles[0]);
  };

  const handleGroupTypeChange = (ev) => {
    setGroupType(ev.target.value);
  };

  const handleNewLabel = (e) => {
    if (e.key === 'Enter') {
      if (!labels.includes(e.target.value)) {
        setLabels([...labels, e.target.value]);
      }
      e.target.value = '';
      e.preventDefault();
    }
  };

  const handleLabelDelete = (labelToDelete) => {
    setLabels((prev) => prev.filter((label) => label !== labelToDelete));
  };

  const handleClose = async () => {
    // TODO: new group should be fetched from server
    let uploadedFile = { file: { id: '' } };
    if (uploadFile !== '') {
      uploadedFile = await upload(uploadFile);
    }

    const newGroup = {
      groupName: document.getElementById('groupName').value,
      groupType,
      topics: labels,
      groupIcon: uploadedFile.file.id,
      creatorId: sessionStorage.getItem('userId'),
    };
    const res = await createGroup(newGroup);
    // console.log(res);

    if ('error' in res) {
      setError(res.error);
    } else {
      createGroupPop();
      setError('');
      setImageName('');
      setLabels([]);
    }
  };

  const handleCancel = () => {
    createGroupPop();
    setImageName('');
    setError('');
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to create a new group.
          </DialogContentText>
          {
            error && (<Alert severity="error">{error}</Alert>)
          }
          <TextField
            autoFocus
            margin="normal"
            id="groupName"
            label="Group Name"
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
              if (imageName === '') {
                return (
                  <div
                    id="dropzone"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <span>{isDragActive ? <UploadFileRoundedIcon /> : <InsertPhotoIcon />}</span>
                    <p>Drag & drop group icon here</p>
                  </div>
                );
              }
              return (
                <div
                  id="dropzone"
                >
                  <p>
                    {imageName}
                    {' '}
                    selected
                  </p>
                </div>
              );
            }}
          </Dropzone>
          <TextField
            margin="normal"
            id="groupLabels"
            label="Group Labels"
            type="text"
            fullWidth
            variant="outlined"
            onKeyDown={handleNewLabel}
            helperText="Press Enter to add a label"
          />
          <ChipsArray labels={labels} handleLabelDelete={handleLabelDelete} />
          <br />
          <FormControl component="fieldset">
            <FormLabel component="legend">Group Type</FormLabel>
            <RadioGroup row aria-label="groupType" onChange={handleGroupTypeChange} name="row-radio-buttons-group">
              <FormControlLabel value="public" control={<Radio />} label="Public" />
              <FormControlLabel value="private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewGroup;
