import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Typography, Container, Box, CircularProgress } from '@mui/material';

function AcceptInvitation() {
console.log('AcceptInvitation component rendered');
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const acceptInvitation = async () => {
      console.log('Attempting to accept invitation with token:', token);
      try {
        const response = await axiosInstance.post(`/api/invitation/${token}/accept`);
        console.log('Response received:', response);
        setStatus('success');
        
        // Store family information in localStorage
        if (response.data.Family) {
          localStorage.setItem('familyId', response.data.Family.FamilyId);
          localStorage.setItem('familyName', response.data.Family.FamilyName);
        }
        
        // Check if the user exists and navigate accordingly
        if (response.data.UserExists) {
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setTimeout(() => navigate('/register', { 
            state: { 
              email: response.data.InviteeEmail,
              familyId: response.data.Family.FamilyId,
              familyName: response.data.Family.FamilyName
            } 
          }), 3000);
        }
      } catch (error) {
        console.error('Failed to accept invitation', error);
        setStatus('error');
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Accepting invitation...
            </Typography>
          </>
        )}
        {status === 'success' && (
          <Typography variant="h6" color="success.main">
            Invitation accepted successfully! Redirecting...
          </Typography>
        )}
        {status === 'error' && (
          <Typography variant="h6" color="error">
            Failed to accept invitation. Please try again or contact support.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default AcceptInvitation;