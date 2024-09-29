import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function CreateFamily() {
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Add this line
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (token) { // Add this block
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }
    try {
      // Create the family
      const familyResponse = await axiosInstance.post('api/family/add', {
        name: familyName,
        userId: userId,
      });

      console.log('Family created', familyResponse.data);
      // Store the familyId in localStorage
      localStorage.setItem('familyId', familyResponse.data.id);
      // Navigate to the AddFamilyMembers component
      navigate('/add-family-members');
    } catch (error) {
      console.error('Failed to create family', error.response || error);
      setError(error.response?.data?.message || 'An error occurred while creating the family');
      if (error.response?.status === 401) {
        // Add this block to handle 401 errors
        setError('Authentication failed. Please log in again.');
        // Optionally, you can redirect to the login page
        // navigate('/login');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a Family
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="familyName"
            label="Family Name"
            name="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Family
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateFamily;