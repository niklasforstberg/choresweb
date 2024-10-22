import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Container, Stack, Card, CardContent, Divider, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import PeopleIcon from '@mui/icons-material/People';
import MailIcon from '@mui/icons-material/Mail';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
    <Stack direction="row" flexWrap="wrap" spacing={3} sx={{ padding: 3 }}>
      {/* Family Members Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <PeopleIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Family Members
            </Typography>
            <Stack direction="column" spacing={1}>
              {familyMembers.map((member, index) => (
                <Typography variant="body1" key={index}>
                  {member.firstName} {member.lastName}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Active Invitations Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MailIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Active Invitations
            </Typography>
            <List>
              {invitations.map((invitation) => (
                <ListItem key={invitation.id}>
                  <ListItemText primary={invitation.InviteeEmail} />
                  <Chip 
                    label={invitation.Status} 
                    color={invitation.Status === 'Accepted' ? 'success' : 'default'} 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Chores Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              
              Recent Chores
            </Typography>
            <List>
              {recentChores.map((chore) => (
                <ListItem key={chore.id}>
                  <ListItemText 
                    primary={chore.task} 
                    secondary={`Done by ${chore.doneBy} on ${chore.date}`} 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>

      {/* Family Budget Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AttachMoneyIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Family Budget
            </Typography>
            <Typography variant="h4" color="primary">
              $1,234.56
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly budget remaining
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">
              Next allowance day: April 30, 2023
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Upcoming Events Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <CalendarTodayIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Upcoming Family Events
            </Typography>
            <List>
              <ListItem>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>20</Avatar>
                <ListItemText primary="Family Game Night" secondary="April 20, 2023" />
              </ListItem>
              <ListItem>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>25</Avatar>
                <ListItemText primary="Grandma's Birthday" secondary="April 25, 2023" />
              </ListItem>
              <ListItem>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>01</Avatar>
                <ListItemText primary="Family Picnic" secondary="May 1, 2023" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
export default Dashboard;
