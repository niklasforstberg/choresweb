import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

// Dashboard component for displaying user's dashboard
function Dashboard() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [recentChores, setRecentChores] = useState([]);

  const familyName = localStorage.getItem('familyName');
  const userName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;
  const familyId = localStorage.getItem('familyId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, invitationsRes, choresRes] = await Promise.all([
          axiosInstance.get(`/api/family/${familyId}/getfamilymembers`),
          axiosInstance.get(`/api/family/${familyId}/invitations`),
          axiosInstance.get('/api/chorelog/recent/5')
        ]);

        setFamilyMembers(membersRes.data);
        setInvitations(invitationsRes.data);
        setRecentChores(choresRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [familyId]);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome, {userName}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {familyName}
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                Family Members
              </Typography>
              <List>
                {familyMembers.map((member) => (
                  <ListItem key={member.id} disablePadding>
                    <ListItemButton component={Link} to={`/profile/${member.id}`}>
                      <ListItemText primary={`${member.firstName} ${member.lastName}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Invitations
              </Typography>
              <List>
                {invitations.map((invitation) => (
                  <ListItem key={invitation.id} disablePadding>
                    <ListItemButton component={Link} to="/invitations">
                      <ListItemText primary={invitation.email} secondary={invitation.status} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Recent Chore Logs
              </Typography>
              <List>
                {recentChores.map((chore) => (
                  <ListItem key={chore.id} disablePadding>
                    <ListItemButton component={Link} to="/chore-log">
                      <ListItemText 
                        primary={chore.choreName} 
                        secondary={`${chore.completedBy} - ${new Date(chore.completedAt).toLocaleDateString()}`} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
