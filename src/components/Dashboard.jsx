import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Typography, List, ListItem, ListItemText, Paper, Grid } from '@mui/material';

// Dashboard component for displaying user's dashboard
function Dashboard() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const familyId = decodedToken.familyId; // Assuming familyId is included in the JWT

        const [membersResponse, invitationsResponse] = await Promise.all([
          axios.get(`/api/family/${familyId}/users`),
          axios.get(`/api/family/${familyId}/invitations`)
        ]);

        setFamilyMembers(membersResponse.data);
        setInvitations(invitationsResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>Family Members</Typography>
            <List>
              {familyMembers.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText primary={`${member.givenName} ${member.surname}`} secondary={member.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>Active Invitations</Typography>
            <List>
              {invitations.map((invitation) => (
                <ListItem key={invitation.id}>
                  <ListItemText primary={invitation.email} secondary={`Invited on: ${new Date(invitation.createdAt).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;