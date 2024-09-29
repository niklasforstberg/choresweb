import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';

function FamilyOptions() {
  const navigate = useNavigate();

  const handleCreateFamily = () => {
    navigate('/create-family');
  };

  const handleApplyToFamily = () => {
    // This route doesn't exist yet, but we'll assume it will be implemented
    navigate('/apply-to-family');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Welcome! Choose your next step:
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleCreateFamily}
        >
          Create a New Family
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={handleApplyToFamily}
        >
          Apply to an Existing Family
        </Button>
      </Box>
    </Container>
  );
}

export default FamilyOptions;