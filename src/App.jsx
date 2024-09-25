import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
// Import the CreateFamily component (you'll need to create this component)
import CreateFamily from './components/CreateFamily';

// Main App component
function App() {
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* Main layout container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header component with login status and logout functionality */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
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
