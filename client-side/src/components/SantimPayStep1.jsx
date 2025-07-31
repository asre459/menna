import React, { useEffect, useState } from 'react';

function SantimPayStep1({ onNext, setPartner }) {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('https://asremenaapp.onrender.com/api/partners')
      .then((res) => res.json())
      .then((data) => setPartners(data.partners))
      .catch(console.error);
  }, []);

  const handleNext = () => {
    if (!selected) {
      alert('Please select a payment method.');
      return;
    }
    setPartner(selected);
    onNext();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💳 Select Payment Method</h2>
        <ul style={styles.list}>
          {partners.map((p) => (
            <li key={p.id} style={styles.listItem}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="partner"
                  value={p.id}
                  onChange={() => setSelected(p)}
                  style={styles.radioInput}
                />
                <div>
                  <strong>{p.name}</strong><br />
                  <span style={styles.description}>{p.description}</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
        <button style={styles.button} onClick={handleNext}>
          👉 Next
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
    maxWidth: '500px',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '2px solidrgb(247, 239, 221)',
    paddingBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '20px',
  },
  listItem: {
    marginBottom: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '10px',
    transition: 'background 0.3s',
    backgroundColor: '#cfcfc',
  },
  radioLabel: {
    display: 'flex',
    gap: '10px',
    cursor: 'pointer',
  },
  radioInput: {
    transform: 'scale(1.2)',
    marginTop: '5px',
  },
  description: {
    fontSize: '14px',
    color: '#666',
  },
  button: {
    marginTop: '10px',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#f0a500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default SantimPayStep1;
