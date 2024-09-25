import React from 'react';

// UserStatus component for displaying user login status and environment
function UserStatus({ isLoggedIn }) {
  // Get the current environment from Vite's environment variables
  const environment = import.meta.env.VITE_ENV;

  return (
    <div>
      {/* Display login status */}
      <div>{isLoggedIn ? 'Logged In' : 'Not Logged In'}</div>
      {/* Display current environment */}
      <div>Environment: {environment}</div>
    </div>
  );
}

export default UserStatus;