import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT token
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box mt={10} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Welcome to Quiz App
        </Typography>
        <Typography variant="body1" gutterBottom>
          Select a topic and start your quiz!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
