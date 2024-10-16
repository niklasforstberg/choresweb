import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axiosInstance from '../utils/axiosConfig';

function AddChoreLog() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedChore, setSelectedChore] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState('');
  const familyId = localStorage.getItem('familyId');
  const reportedByUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchFamilyMembers();
    fetchChores();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axiosInstance.get('api/family/getall');
      setFamilyMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch family members', error);
    }
  };

  const fetchChores = async () => {
    try {
      const response = await axiosInstance.get(`api/chore/getall/${familyId}`);
      setChores(response.data);
    } catch (error) {
      console.error('Failed to fetch chores', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedChore) {
      alert('Please select a family member and a chore');
      return;
    }

    try {
      const response = await axiosInstance.post('api/chore/add', {
        isCompleted: true,
        dueDate: dueDate.toISOString(),
        choreId: selectedChore.id,
        userId: selectedMember.id,
        choreName: selectedChore.name,
        userName: `${selectedMember.firstName} ${selectedMember.lastName}`,
        reportedByUserId: parseInt(reportedByUserId)
      });

      setSuccessMessage(`Chore log added: ${selectedChore.name} completed by ${selectedMember.firstName} ${selectedMember.lastName}`);
      setSelectedMember(null);
      setSelectedChore(null);
      setDueDate(new Date());
    } catch (error) {
      console.error('Failed to add chore log', error);
      alert('Failed to add chore log. Please try again.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Add Chore Log
        </Typography>

        {successMessage && (
          <Typography color="success" gutterBottom>
            {successMessage}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Select Family Member
          </Typography>
          <Carousel>
            {familyMembers.map((member) => (
              <Box
                key={member.id}
                onClick={() => setSelectedMember(member)}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: selectedMember?.id === member.id ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                <Typography>{`${member.firstName} ${member.lastName}`}</Typography>
              </Box>
            ))}
          </Carousel>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Select Chore
          </Typography>
          <Carousel>
            {chores.map((chore) => (
              <Box
                key={chore.id}
                onClick={() => setSelectedChore(chore)}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: selectedChore?.id === chore.id ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                <Typography>{chore.name}</Typography>
              </Box>
            ))}
          </Carousel>

          <DateTimePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Chore Log
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default AddChoreLog;
