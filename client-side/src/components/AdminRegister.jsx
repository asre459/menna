import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('https://menna.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'admin' })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/admin-login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2>Admin Register</h2>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        {message && <p style={message.includes('success') ? styles.success : styles.error}>{message}</p>}
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
    width: '300px' 
  },
  input: { 
    marginBottom: '1rem', 
    padding: '0.75rem', 
    width: '100%', 
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: { 
    background: '#4B0082', 
    color: '#fff', 
    padding: '0.75rem', 
    border: 'none', 
    width: '100%', 
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  error: {
    color: '#f44336',
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  success: {
    color: '#4CAF50',
    marginTop: '1rem',
    fontSize: '0.9rem'
  }
};

export default AdminRegister;