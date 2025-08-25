import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator ';

function Donate() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount || amount;

    if (!name.trim() || !finalAmount) {
      alert('Please provide your name and donation amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://menna.onrender.com/api/donations/met', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, amount: finalAmount}),
      });

      const data = await response.json();

      if (response.ok) {
        // alert('Donation info received. Proceeding to payment...');
        navigate('/santimpay', { state: { name, amount: finalAmount ,contact ,  donationId: data.donationId } });// Add this line
        setName('');
        setContact('');
        setAmount('');
        setCustomAmount('');
      } else {
        console.error('Donation error:', data);
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Server error:', err);
      alert('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ደግ ልቦች</h1>
      <p style={styles.subtitle}>Donation Form (የልገሳ ቅጽ)</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name (ስም)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Phone or Email (እባክዎን ስልክ ወይም ኢሜይል)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={styles.input}
        />

        <p style={styles.sectionLabel}>
          Select Amount (በሚወዱትን የገንዘብ መጠን ይምረጡ)
        </p>

        <div style={styles.radioGroup}>
          {[20, 100, 200].map((value) => (
            <label key={value} style={styles.radioLabel}>
              <input
                type="radio"
                name="amount"
                value={value}
                checked={amount === String(value)}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setCustomAmount('');
                }}
              />
              <span style={styles.radioText}>{value} Birr</span>
            </label>
          ))}
        </div>

        <input
          type="number"
          placeholder="enter custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount('');
          }}
          style={styles.input}
        />
        


        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Submitting...' : 'Proceed to Donate'}
        </button>
      </form>

      {loading && <ProgressIndicator />}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#fffdf4',
    border: '1px solid hsl(33, 100%, 88%)',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
 title: {
    fontSize: '2rem',
    color: '#444',
    marginBottom: '5px',
  },
  subtitle: {
    color: '#777',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    outlineColor: '#f0a500',
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginTop: '15px',
    fontSize: '16px',
  },
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#fef1d1',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #f0a500',
    cursor: 'pointer',
  },
  radioText: {
    fontWeight: '500',
  },
  button: {
    padding: '12px',
    backgroundColor: '#f0a500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default Donate;
