import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateFamily from './components/CreateFamily';
import { jwtDecode } from 'jwt-decode';

// Main App component
function App() {
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [userName, setUserName] = useState('');

  // Effect to decode JWT token and set user name
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('Token before decoding:', token); // Add this line
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken); // Add this line
        // Access the claims using the new, simplified identifiers
        const firstName = decodedToken.firstName || '';
        const lastName = decodedToken.lastName || '';
        setUserName(`${firstName} ${lastName}`);

        // If you need to store the user ID, you can do it here
        localStorage.setItem('userId', decodedToken.id || '');
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle the error (e.g., clear the invalid token, redirect to login)
        localStorage.removeItem('token');
        // setIsLoggedIn(false); // If you have this state
      }
    }
  }, [isLoggedIn]);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName(''); // Clear user name on logout
  };

  return (
    <Router>
      {/* Main layout container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header component with login status and logout functionality */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} userName={userName} />
        
        {/* Main content container */}
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Routes>
            {/* Route for home page, redirects to dashboard if logged in */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Route for user registration */}
            <Route path="/register" element={<Register />} />
            
            {/* Protected route for dashboard, redirects to login if not authenticated */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />

            {/* New protected route for CreateFamily */}
            <Route path="/create-family" element={isLoggedIn ? <CreateFamily /> : <Navigate to="/" />} />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
