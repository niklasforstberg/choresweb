import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateFamily from './components/CreateFamily';
import { jwtDecode } from 'jwt-decode';
import FamilyOptions from './components/FamilyOptions';

// Main App component
function App() {
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  // Effect to decode JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Raw token:', token); // Log the raw token
      try {
        if (token.split('.').length !== 3) {
          throw new Error('Token does not have three parts');
        }
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken); // Add this line
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('firstName', decodedToken.firstName);
        localStorage.setItem('lastName', decodedToken.lastName);
        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('fullName', `${decodedToken.firstName} ${decodedToken.lastName}`);
;
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false); 
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
    localStorage.setItem('userId', '');
    localStorage.setItem('firstName', '');
    localStorage.setItem('lastName', '');
    localStorage.setItem('userRole', '');
    localStorage.setItem('email', '');
    localStorage.setItem('fullName', '');

  };

  return (
    <Router>
      {/* Main layout container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header component with login status and logout functionality */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} userName={localStorage.getItem('fullName')} />
        
        {/* Main content container */}
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Routes>
            {/* Route for home page, redirects to dashboard if logged in */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Route for user registration */}
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Protected route for dashboard, redirects to login if not authenticated */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />

            {/* New protected route for CreateFamily */}
            <Route path="/create-family" element={isLoggedIn ? <CreateFamily /> : <Navigate to="/" />} />

            {/* New route for FamilyOptions */}
            <Route path="/family-options" element={isLoggedIn ? <FamilyOptions /> : <Navigate to="/" />} />
            
            {/* You'll need to create this component and route when ready */}
            {/* <Route path="/apply-to-family" element={isLoggedIn ? <ApplyToFamily /> : <Navigate to="/" />} /> */}
            
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
