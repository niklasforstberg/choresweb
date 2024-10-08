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
import AddFamilyMembers from './components/AddFamilyMembers';
import AcceptInvitation from './components/AcceptInvitation';

// Main App component
function App() {
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  // Effect to decode JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Raw token in app.jsx:', token);
      try {
        if (token.split('.').length !== 3) {
          throw new Error('Token does not have three parts');
        }
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('firstName', decodedToken.firstName);
        localStorage.setItem('lastName', decodedToken.lastName);
        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('fullName', `${decodedToken.firstName} ${decodedToken.lastName}`);
        localStorage.setItem('familyId', decodedToken.familyId);
        localStorage.setItem('familyName', decodedToken.familyName);
        console.log('userId:', localStorage.getItem('userId'));
        console.log('firstName:', localStorage.getItem('firstName'));
        console.log('lastName:', localStorage.getItem('lastName'));
        console.log('userRole:', localStorage.getItem('userRole'));
        console.log('email:', localStorage.getItem('email'));
        console.log('fullName:', localStorage.getItem('fullName'));
        console.log('familyId:', localStorage.getItem('familyId'));
        console.log('familyName:', localStorage.getItem('familyName'));


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
    localStorage.setItem('familyId', '');
    localStorage.setItem('familyName','');
  };

  return (
    <Router>
      {/* Main layout container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header component with login status and logout functionality */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} fullName={localStorage.getItem('fullName')} />
        
        {/* Main content container */}
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Routes>
            {/* Route for home page, redirects to dashboard if logged in */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Route for user registration */}
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
            
            {/*  protected route  */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/create-family" element={isLoggedIn ? <CreateFamily /> : <Navigate to="/" />} />
            <Route path="/family-options" element={isLoggedIn ? <FamilyOptions /> : <Navigate to="/" />} />
            <Route path="/add-family-members" element={isLoggedIn ? <AddFamilyMembers /> : <Navigate to="/" />} />
            <Route path="/accept-invitation/:token/accept" element={<AcceptInvitation />} />
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
