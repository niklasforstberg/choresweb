import React from 'react';

function UserStatus({ isLoggedIn }) {
  const environment = import.meta.env.VITE_ENV;

  return (
    <div>
      <div>{isLoggedIn ? 'Logged In' : 'Not Logged In'}</div>
      <div>Environment: {environment}</div>
    </div>
  );
}

export default UserStatus;