import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';


function CreateFamily() {
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Create the family
      const familyResponse = await axiosInstance.post('api/family/add', {
        name: familyName,
      });

      console.log('Family created', familyResponse.data);
      // Handle success (e.g., show success message, redirect)
    } catch (error) {
      console.error('Failed to create family', error.response || error);
      setError(error.response?.data?.message || 'An error occurred while creating the family');
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