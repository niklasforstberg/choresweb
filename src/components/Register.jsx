import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';

// Register component for user registration
function Register({ onLoginSuccess }) {  // Add this prop
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for form inputs and error handling
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  
  // Use effect to handle invitation data
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prevData => ({
        ...prevData,
        email: location.state.email
      }));
    }
    if (location.state?.familyId && location.state?.familyName) {
      // Store family information in localStorage
      localStorage.setItem('familyId', location.state.familyId);
      localStorage.setItem('familyName', location.state.familyName);
    }
  }, [location.state]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic form validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Retrieve familyId from localStorage
      const familyId = localStorage.getItem('familyId');

      // Send registration request to the API
      const response = await axiosInstance.post('api/security/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        familyId: familyId
      });
      console.log('Registration response:', response);

      if (response.data && response.data.token) {
        // Call onLoginSuccess with the token
        onLoginSuccess(response.data.token);
        
        console.log('About to navigate to /family-options');
        navigate('/family-options');
        console.log('Navigation called');
      } else {
        setError('Registration successful, but no token received');
      }
    } catch (error) {
      console.error('Registration failed', error.response || error);
      setError(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          Register
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!!location.state?.email} // Disable if email is provided from invitation
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box textAlign="center">
            <Link to="/">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;