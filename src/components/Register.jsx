import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

// Register component for user registration
function Register() {
  // State for form inputs and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Send registration request to the API
      const response = await axiosInstance.post('api/security/register', { 
        email, 
        password,
        username: email // Using email as username
      });
      console.log('Registration response:', response);
      if (response.data) {
        // Store the token and redirect to dashboard
        localStorage.setItem('token', response.data);
        navigate('/dashboard');
      } else {
        setError('Registration successful, but no token received');
      }
    } catch (error) {
      console.error('Registration failed', error.response || error);
      setError(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;