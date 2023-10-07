import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Checkbox, FormControlLabel, Button, Link, CssBaseline, Paper} from '@mui/material';
import Helmet from 'react-helmet';

import logo from "../../assets/img/logo/logo-name1.png"
import './index.scss';

function LoginComponent({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('login');
    if (typeof onLogin === 'function') { // Now you can directly use onLogin without props.
      onLogin(); // Call the onLogin prop function to simulate successful login
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Helmet>
        <title>Sign in</title>
        <meta name="description" content="" />
      </Helmet>

    <Box className="logo-col">
      <Typography variant="h3" className="logo-text">
        Welcome to
      </Typography>
      <img src={logo} alt="logo" className="logo-img" />
    </Box>

      <Paper elevation={3} className="login-paper">
        <Typography variant="h5">Sign in</Typography>
        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                value={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label={<Typography className="checkbox-label">Remember me</Typography>}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Sign In
          </Button>
          <div className="forgot-password">
            <Link href="#">Forgot password?</Link>
          </div>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginComponent;
