import React, { useState } from 'react';

function SantimPayStep2({ partner, onNext }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    if (!input.trim()) {
      alert(`Please enter a valid ${partner.input}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://menna.onrender.com/api/partners/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: partner.id, inputValue: input }),
      });

      const data = await res.json();
      if (data.valid) {
        alert('✅ Validated! Proceeding to confirmation...');
        onNext(input); // Pass input to parent if needed
      } else {
        alert(`❌ Invalid ${partner.input}. Please try again.`);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🔐 Enter {partner.input}</h2>
        <input
          type="text"
          placeholder={`Your ${partner.input}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleValidation} style={styles.button} disabled={loading}>
          {loading ? 'Validating...' : 'Validate and Continue'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fefbe9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '20px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#f0a500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default SantimPayStep2;
