import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';

// Header component with collapsible menu
function Header({ isLoggedIn, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isLoggedIn && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                Dashboard
              </MenuItem>
              <MenuItem component={Link} to="/create-family" onClick={handleMenuClose}>
                CreateFamily
              </MenuItem>
            </Menu>
          </>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Removed "Chores App" text */}
        </Typography>
        {isLoggedIn ? (
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        ) : (
          location.pathname !== '/' && <Button color="inherit" component={Link} to="/">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;