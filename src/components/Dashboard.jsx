import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Container, Stack, Card, CardContent, Divider, Chip, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import PeopleIcon from '@mui/icons-material/People';
import MailIcon from '@mui/icons-material/Mail';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Dashboard component for displaying user's dashboard
function Dashboard() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [choreData, setChoreData] = useState([]);
  const [recentChores, setRecentChores] = useState([]);

  const familyName = localStorage.getItem('familyName');
  const userName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;
  const familyId = localStorage.getItem('familyId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, invitationsRes, choresRes] = await Promise.all([
          axiosInstance.get(`/api/family/${familyId}/getfamilymembers`),
          axiosInstance.get(`/api/invitations/family/${familyId}`),
        ]);

        setFamilyMembers(membersRes.data);
        setInvitations(invitationsRes.data);
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
          axiosInstance.get(`/api/chore/getall/${familyId}`)
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

  useEffect(() => {
    const fetchRecentChores = async () => {
      try {
        const response = await axiosInstance.get(`/api/chorelog/recent/3`);
        setRecentChores(response.data);
      } catch (error) {
        console.error('Error fetching recent chores:', error);
      }
    };

    fetchRecentChores();
  }, []);

  return (
    <Stack 
      className="dashboard-stack"
      direction={{ xs: 'column', sm: 'row' }} 
      flexWrap="wrap" 
      sx={{ padding: 3 }}
    >
      {/* Family Members Card */}
      <Stack className="dashboard-card-wrapper">
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

      {/* Chore Statistics Card */}
      <Stack className="dashboard-card-wrapper">
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

      {/* Active Invitations Card */}
      <Stack className="dashboard-card-wrapper">
        <Card className="dashboard-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MailIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Active Invitations
            </Typography>
            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
              {invitations.map((invitation) => (
                <ListItem key={invitation.id} disablePadding>
                  <ListItemButton>
                    <ListItemText 
                      primary={invitation.inviteeEmail} 
                      primaryTypographyProps={{ noWrap: true }}
                    />
                    <Chip 
                      label={invitation.status} 
                      color={invitation.status === 'Accepted' ? 'success' : 'default'} 
                      size="small" 
                      sx={{ ml: 1, flexShrink: 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Chores Card */}
      <Stack className="dashboard-card-wrapper">
        <Card className="dashboard-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Recent Chores
            </Typography>
            <List>
              {recentChores.map((chore, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={chore.choreName}
                    secondary={`${chore.userName} - ${new Date(chore.completedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>

    </Stack>


  );
}

export default Dashboard;
