

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  const requestBody = JSON.stringify({ username, password });

  try {
    const res = await fetch('https://menna.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    const data = await res.json();

    if (!res.ok) {
      // Show backend-provided error message if available
      throw new Error(data.message || 'Login failed. Please try again.');
    }

    // Role check for admin access
    if (!data.user || data.user.role !== 'admin') {
      throw new Error('Access denied: Admin privileges required.');
    }

    // Save token + user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to admin dashboard
    navigate('/admin-dashboard');

  } catch (err) {
    // Log to console for debugging AND show in UI
    console.error('Login error:', err.message);
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Admin Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter admin username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  form: { 
    background: '#fff', 
    padding: '2rem', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    color: '#4B0082',
    marginBottom: '1.5rem'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  },
  input: { 
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  button: { 
    background: '#4B0082', 
    color: '#fff', 
    padding: '0.75rem', 
    border: 'none',
    borderRadius: '4px',
    width: '100%',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s',
    ':hover': {
      background: '#3a0068'
    }
  },
  error: {
    color: '#f44336',
    backgroundColor: '#fdecea',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    textAlign: 'center'
  }
};

export default AdminLogin;