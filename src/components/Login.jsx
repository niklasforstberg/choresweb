import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

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
      console.log('Attempting to log in with:', { email, password });
      // Send login request to the API
      const response = await axiosInstance.post('api/security/login', { 
        email, 
        password,
        username: email // Using email as username since the API doesn't use it
      });
      console.log('Login response:', response);
      
      if (response.data) {
        const token = response.data; // The token is directly in response.data
        localStorage.setItem('token', token);
        
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        
        // Store user information from the decoded token
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('firstName', decodedToken.firstName);
        localStorage.setItem('lastName', decodedToken.lastName);
        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('fullName', `${decodedToken.firstName} ${decodedToken.lastName}`);
        
        console.log('User information stored in localStorage');
        onLoginSuccess();
        navigate('/dashboard');
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