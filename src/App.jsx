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
import ManageChores from './components/ManageChores';
import AddChoreLog from './components/AddChoreLog';

// Main App component
function App() {
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Function to handle token processing
  const processToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const newUserInfo = {
        userId: decodedToken.id,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        fullName: `${decodedToken.firstName} ${decodedToken.lastName}`,
        userRole: decodedToken.role,
        email: decodedToken.email,
        familyId: decodedToken.familyId,
        familyName: decodedToken.familyName,
      };
      setUserInfo(newUserInfo);
      setIsLoggedIn(true);

      // Set localStorage items
      localStorage.setItem('token', token);
      Object.entries(newUserInfo).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      return true;
    } catch (error) {
      console.error('Error processing token:', error);
      handleLogout();
      return false;
    }
  };

  // Effect to decode JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      processToken(token);
    }
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = (token) => {
    processToken(token);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserInfo({});
  };

  return (
    <Router>
      {/* Main layout container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header component with login status and logout functionality */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} fullName={userInfo.fullName} />
        
        {/* Main content container */}
        <Container component="main" sx={{ mt: 1, mb: 4, flex: 1 }}>
          <Routes>
            {/* Route for home page, redirects to dashboard if logged in */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/add-chore-log" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Route for user registration */}
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
            
            {/*  protected route  */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/create-family" element={isLoggedIn ? <CreateFamily /> : <Navigate to="/" />} />
            <Route path="/family-options" element={isLoggedIn ? <FamilyOptions /> : <Navigate to="/" />} />
            <Route path="/add-family-members" element={isLoggedIn ? <AddFamilyMembers /> : <Navigate to="/" />} />
            <Route path="/accept-invitation/:token/accept" element={<AcceptInvitation />} />
            <Route path="/manage-chores" element={isLoggedIn ? <ManageChores /> : <Navigate to="/" />} />
            <Route path="/add-chore-log" element={isLoggedIn ? <AddChoreLog /> : <Navigate to="/" />} />
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
