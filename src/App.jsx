import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header isLoggedIn={isLoggedIn} />
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
