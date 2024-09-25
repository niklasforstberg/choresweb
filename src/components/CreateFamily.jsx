import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, List, ListItem } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';

function CreateFamily() {
  const [familyName, setFamilyName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  const handleAddMember = () => {
    if (memberEmail && !members.includes(memberEmail)) {
      setMembers([...members, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // First, create the family
      const familyResponse = await axiosInstance.post('api/families', {
        name: familyName
      });
      const familyId = familyResponse.data.id;

      // Then, create invitations for each member
      const invitationPromises = members.map(email => 
        axiosInstance.post('api/invitations', {
          familyId,
          inviteeEmail: email
        })
      );
      await Promise.all(invitationPromises);

      console.log('Family created and invitations sent');
      // Handle success (e.g., show success message, redirect)
    } catch (error) {
      console.error('Failed to create family or send invitations', error.response || error);
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
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              id="memberEmail"
              label="Member Email"
              name="memberEmail"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
            <Button
              onClick={handleAddMember}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Member
            </Button>
          </Box>
          <List>
            {members.map((email, index) => (
              <ListItem key={index}>{email}</ListItem>
            ))}
          </List>
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