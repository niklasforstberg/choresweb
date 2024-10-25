import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Container, Stack, Card, CardContent, Divider, Chip, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [choreData, setChoreData] = useState([]);

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

  useEffect(() => {
    const fetchChoreData = async () => {
      try {
        const [membersRes, choresRes] = await Promise.all([
          axiosInstance.get(`/api/family/${familyId}/getfamilymembers`),
          axiosInstance.get('/api/chores') // Assuming this endpoint returns all chores
        ]);

        const members = membersRes.data;
        const chores = choresRes.data;

        const choreCountPromises = chores.map(chore =>
          Promise.all(members.map(member =>
            axiosInstance.get(`/api/chorelog/count/${member.id}/${chore.id}`)
          ))
        );

        const choreCountsData = await Promise.all(choreCountPromises);

        const processedChoreData = chores.map((chore, index) => {
          const choreData = { name: chore.name };
          members.forEach((member, memberIndex) => {
            choreData[member.firstName] = choreCountsData[index][memberIndex].data.count;
          });
          return choreData;
        });

        setChoreData(processedChoreData);
      } catch (error) {
        console.error('Error fetching chore data:', error);
      }
    };

    fetchChoreData();
  }, [familyId]);

  return (
    <Stack direction="row" flexWrap="wrap" spacing={3} sx={{ padding: 3 }}>
      {/* Family Members Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card className="dashboard-card">
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
        <Card className="dashboard-card">
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

      {/* Chore Statistics Card */}
      <Stack sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
        <Card className="dashboard-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Chore Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={choreData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {familyMembers.map((member, index) => (
                  <Bar
                    key={member.id}
                    dataKey={member.firstName}
                    fill={`hsl(${index * 360 / familyMembers.length}, 70%, 50%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

export default Dashboard;
