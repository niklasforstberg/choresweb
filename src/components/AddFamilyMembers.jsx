import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

function AddFamilyMembers() {
  const [invitees, setInvitees] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [error, setError] = useState('');
  const [familyId, setFamilyId] = useState(null);
  const [inviterId, setInviterId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFamilyId = localStorage.getItem('familyId');
    const storedUserId = localStorage.getItem('userId');

    if (storedFamilyId) {
      setFamilyId(storedFamilyId);
    }
    if (storedUserId) {
      setInviterId(storedUserId);
    }
  }, []);

  const handleAddInvitee = () => {
    if (currentEmail && !invitees.includes(currentEmail)) {
      setInvitees([...invitees, currentEmail]);
      setCurrentEmail('');
    }
  };

  const handleRemoveInvitee = (email) => {
    setInvitees(invitees.filter(invitee => invitee !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!familyId) {
      setError('Family ID not found. Please create a family first.');
      return;
    }

    if (!inviterId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const invitationDtos = invitees.map(email => ({
        familyId: familyId,
        inviteeEmail: email,
        inviterId: inviterId
      }));

      await axiosInstance.post('/api/invitations/create', invitationDtos);

      navigate(`/family-invitations/${familyId}`);
    } catch (error) {
      console.error('Failed to send invitations', error.response || error);
      setError(error.response?.data?.message || 'An error occurred while sending invitations');
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Family Members
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Family Member Email"
            name="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <Button
            onClick={handleAddInvitee}
            disabled={!currentEmail}
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Add
          </Button>
          <List>
            {invitees.map((email, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveInvitee(email)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={email} />
              </ListItem>
            ))}
          </List>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={invitees.length === 0}
          >
            Send Invitations
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddFamilyMembers;