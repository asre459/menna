// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import QRCode from 'react-qr-code'; // ✅ Correct import

// function ReceiptPage() {
//   const location = useLocation();
//   const data = location.state;

//   if (!data) return <p style={styles.error}>🚫 No donation data found.</p>;

//   const qrText = `Thank you for your donation!\nName: ${data.name}\nAmount: ${data.amount} Birr\nPayment Method: ${data.partner.name}\n${data.partner.input}: ${data.inputValue}`;

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>🎉 Thank You, {data.name}!</h1>
//         <p style={styles.subtitle}>Your donation was successful 🙌</p>

//         <ul style={styles.list}>
//           <li><strong>Name:</strong> {data.name}</li>
//           <li><strong>Amount:</strong> {data.amount} Birr</li>
//           <li><strong>Payment Method:</strong> {data.partner.name}</li>
//           <li><strong>{data.partner.input}:</strong> {data.inputValue}</li>
//         </ul>

//         <div style={styles.qrSection}>
//           <h3 style={styles.qrTitle}>📄 Scan this QR Code for Receipt:</h3>
//           <QRCode value={qrText} size={180} />
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: '100vh',
//     background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '20px',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: '40px 30px',
//     borderRadius: '16px',
//     boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
//     textAlign: 'center',
//     maxWidth: '450px',
//     width: '100%',
//   },
//   title: {
//     fontSize: '28px',
//     color: '#2b2b2b',
//     marginBottom: '10px',
//   },
//   subtitle: {
//     fontSize: '16px',
//     color: '#555',
//     marginBottom: '20px',
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0,
//     textAlign: 'left',
//     lineHeight: '1.8',
//     marginBottom: '30px',
//   },
//   qrSection: {
//     textAlign: 'center',
//   },
//   qrTitle: {
//     fontSize: '16px',
//     marginBottom: '12px',
//     color: '#444',
//   },
//   error: {
//     padding: '40px',
//     fontSize: '18px',
//     textAlign: 'center',
//     color: 'crimson',
//   },
// };

// export default ReceiptPage;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

function ReceiptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for donationId in URL (coming from ArifPay redirect)
    const params = new URLSearchParams(location.search);
    const donationId = params.get('donationId');

    if (location.state) {
      // Direct navigation (for testing)
      setDonationData(location.state);
      setLoading(false);
    } else if (donationId) {
      // Coming from ArifPay redirect - fetch donation data
      fetchDonationData(donationId);
    } else {
      // No data available
      setLoading(false);
    }
  }, [location]);

  const fetchDonationData = async (donationId) => {
    try {
      const response = await fetch(`https://asremenaapp.onrender.com/api/donations/${donationId}`);
      const data = await response.json();
      setDonationData(data);
    } catch (err) {
      console.error('Failed to fetch donation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading receipt...</div>;
  }

  if (!donationData) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>🚫 No donation data found.</p>
        <button 
          style={styles.backButton} 
          onClick={() => navigate('/donate')}
        >
          Return to Donation Form
        </button>
      </div>
    );
  }

  const qrText = `Thank you for your donation!\nName: ${donationData.name}\nAmount: ${donationData.amount} Birr\nPayment Method: ${donationData.method}\nDate: ${new Date(donationData.date).toLocaleString()}`;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 Thank You, {donationData.name}!</h1>
        <p style={styles.subtitle}>Your donation was successful 🙌</p>

        <ul style={styles.list}>
          <li><strong>Name:</strong> {donationData.name}</li>
          <li><strong>Amount:</strong> {donationData.amount} Birr</li>
          <li><strong>Payment Method:</strong> {donationData.method}</li>
          <li><strong>Date:</strong> {new Date(donationData.date).toLocaleString()}</li>
        </ul>

        <div style={styles.qrSection}>
          <h3 style={styles.qrTitle}>📄 Scan this QR Code for Receipt:</h3>
          <QRCode value={qrText} size={180} />
        </div>

        <button 
          style={styles.backButton} 
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    color: '#2b2b2b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
    lineHeight: '1.8',
    marginBottom: '30px',
  },
  qrSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  qrTitle: {
    fontSize: '16px',
    marginBottom: '12px',
    color: '#444',
  },
  error: {
    padding: '40px',
    fontSize: '18px',
    textAlign: 'center',
    color: 'crimson',
  },
  loading: {
    padding: '40px',
    fontSize: '18px',
    textAlign: 'center',
    color: '#555',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#f0a500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  }
};

export default ReceiptPage;