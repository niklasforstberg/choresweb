import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Typography, Container, Box, CircularProgress } from '@mui/material';

function AcceptInvitation() {
console.log('AcceptInvitation component rendered');
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    const acceptInvitation = async () => {
      console.log('Attempting to accept invitation with token:', token);
      try {
        const response = await axiosInstance.post(`/api/invitation/${token}/accept`);
        console.log('Response received:', response);
        setStatus('success');
        
        // Store family information in localStorage
        if (response.data.family) {
          localStorage.setItem('familyId', response.data.family.familyId);
          localStorage.setItem('familyName', response.data.family.familyName);
        }
        
        // Check if the user exists and navigate accordingly
        if (response.data.userExists) {
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setTimeout(() => navigate('/register', { 
            state: { 
              email: response.data.inviteeEmail,
              familyId: response.data.family.familyId,
              familyName: response.data.family.familyName
            } 
          }), 3000);
        }
      } catch (error) {
        console.error('Failed to accept invitation', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        setStatus('error');
      }
    };

    acceptInvitation();

    return () => {
      effectRan.current = true;
    };
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
