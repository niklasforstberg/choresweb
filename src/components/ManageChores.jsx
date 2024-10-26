import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../utils/axiosConfig';

function ManageChores() {
  const [chores, setChores] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const familyId = localStorage.getItem('familyId');

  useEffect(() => {
    fetchChores();
  }, []);

  const fetchChores = async () => {
    try {
      const response = await axiosInstance.get(`api/chore/getall/${familyId}`);
      setChores(response.data || []); // Ensure chores is always an array
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to fetch chores', error);
      setError('Failed to fetch chores. Please try again.');
      setChores([]); // Reset chores to an empty array in case of error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try { 
      const response = await axiosInstance.post('api/chore/add', {
        name,
        description,
        familyId: parseInt(familyId)
      });
      setChores([...chores, response.data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create chore', error);
      setError('Failed to create chore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`api/chore/delete/${id}`);
      setChores(chores.filter(chore => chore.id !== id));
    } catch (error) {
      console.error('Failed to delete chore', error);
      setError('Failed to delete chore. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Family Chores
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        
        {chores.length > 0 ? (
          <List>
            {chores.map((chore) => (
              <ListItem key={chore.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(chore.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={chore.name} secondary={chore.description} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
            No chores found. Add a new chore below.
          </Typography>
        )}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Add a chore
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Chore Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ManageChores;
