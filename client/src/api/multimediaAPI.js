import axios from 'axios';
import domain from '../constants/profile';

const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${domain}/api/multimedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export default upload;
