import React from 'react';
import { Link } from 'react-router-dom';
import UserStatus from './UserStatus';

function Header({ isLoggedIn }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      backgroundColor: '#f8f9fa',
      padding: '10px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,.1)'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          gap: '20px',
          margin: 0,
          padding: 0
        }}>
          {!isLoggedIn && (
            <>
              <li><Link to="/">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/chores">Chores</Link></li>
              <li><Link to="/add-chore">Add Chore</Link></li>
            </>
          )}
        </ul>
        <UserStatus isLoggedIn={isLoggedIn} />
      </nav>
    </header>
  );
}

export default Header;