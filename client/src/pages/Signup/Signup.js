import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { isEmailValid, isPasswordValid } from '../../shared/utils';
import { register } from '../../api';

const theme = createTheme();

const Signup = () => {
  const history = useHistory();
  const [error, setError] = React.useState({});
  const [info, setInfo] = React.useState('');

  const validate = (data) => {
    const errors = {};
    if (!data.get('email')) {
      errors.email = 'Email is required';
    }
    if (!isEmailValid(data.get('email'))) {
      errors.email = 'Email invalid';
    }
    if (!data.get('password')) {
      errors.password = 'Password is required';
    }
    if (!isPasswordValid(data.get('password'))) {
      errors.password = 'Should be 7-15 characters long';
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newError = validate(data);
    setError(newError);
    if (Object.keys(newError).length === 0) {
      setInfo('');
      setError({});
      const payload = {
        email: data.get('email'),
        password: data.get('password'),
        userName: data.get('userName'),
      };
      const response = await register(payload);
      if ('error' in response) {
        setError({ general: response.error });
        return;
      }
      setInfo(`Successfully registered as ${response.userName}`);
      history.push('/login');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {
                  error.general && (<Alert severity="error">{error.general}</Alert>)
                }
                {
                  info && (<Alert severity="success">{info}</Alert>)
                }
                <TextField
                  error={'email' in error}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={'email' in error && error.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={'username' in error}
                  autoComplete="username"
                  name="userName"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  helperText={'username' in error && error.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={'password' in error}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText={'password' in error && error.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
