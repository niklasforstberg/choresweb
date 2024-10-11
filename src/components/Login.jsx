import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';

// Login component for user authentication
function Login({ onLoginSuccess }) {
  // State for form inputs and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('api/security/login', { 
        email, 
        password,
      });
      
      if (response.data && response.data.token) {
        onLoginSuccess(response.data.token); // Pass the token to handleLoginSuccess
      } else {
        setError('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed', error.response || error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Email input field */}
          <TextField
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
          {/* Password input field */}
          <TextField
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
          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {/* New Register link */}
          <Box textAlign="center">
            <Link to="/register">
              Don't have an account? Register here
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;