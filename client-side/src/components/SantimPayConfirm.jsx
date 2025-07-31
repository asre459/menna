// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// function SantimPayConfirm({ donationData }) {
//   const navigate = useNavigate();

//   const handleConfirm = async () => {
//     try {
//        if (!donationData.donationId) {
//         throw new Error('Missing donation ID');
//       }
//       // First update the donation with the payment method
//       const updateResponse = await fetch(
//         `http://localhost:5000/api/donations/${donationData.donationId}/method`,
//         {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ method: donationData.method })
//         }
//       );

//       if (!updateResponse.ok) {
//         throw new Error('Failed to update payment method');
//       }

//       // Then proceed with payment processing
//       alert('Payment successful! 🎉');
//       navigate('/receipt', { state: { ...donationData ,
//         donnation:await updateResponse.json() }  });
      
//     } catch (err) {
//       console.error('Confirmation error:', err);
//       alert('Payment confirmation failed. Please try again.');
//     }
//   };

//   if (!donationData) {
//     return <p style={styles.error}>Missing donation data. Please return to the form.</p>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Confirm Your Donation</h2>
//         <ul style={styles.list}>
//           <li><strong>Name:</strong> {donationData.name}</li>
//           <li><strong>Amount:</strong> {donationData.amount} Birr</li>
//           <li><strong>Payment Method:</strong> {donationData.partner?.name}</li>
//           <li><strong>{donationData.partner?.input}:</strong> {donationData.inputValue}</li>
//         </ul>

//         <button style={styles.button} onClick={handleConfirm}>
//           ✅ Confirm and Pay
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fdf6e3',
//     padding: '20px',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: '30px',
//     borderRadius: '12px',
//     boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//     width: '100%',
//     maxWidth: '500px',
//     textAlign: 'left',
//   },
//   title: {
//     fontSize: '24px',
//     marginBottom: '20px',
//     color: '#333',
//     borderBottom: '2px solid #f0a500',
//     paddingBottom: '10px',
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0,
//     marginBottom: '30px',
//     fontSize: '16px',
//     color: '#555',
//   },
//   button: {
//     width: '100%',
//     padding: '12px 20px',
//     fontSize: '16px',
//     backgroundColor: '#f0a500',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     transition: 'background 0.3s',
//   },
//   error: {
//     textAlign: 'center',
//     marginTop: '50px',
//     fontSize: '18px',
//     color: 'red',
//   },
// };

// export default SantimPayConfirm;



import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

function SantimPayConfirm({ donationData }) {
  
  const [isProcessing, setIsProcessing] = useState(false);


  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      
      // First update the donation method
      
      // Prepare payment data for ArifPay
      const paymentData = {
        amount: donationData.amount,
        phone: donationData.contact || "251900000000",
        email: donationData.email || "donor@example.com",
        items: [{
          name: "Donation",
          quantity: 1,
          price: donationData.amount,
          description: "Charitable donation"
        }],
        donationId: donationData.donationId,
        successUrl: `${window.location.origin}/receipt?donationId=${donationData.donationId}`,
        cancelUrl: `${window.location.origin}/donate?status=canceled`,
        errorUrl: `${window.location.origin}/donate?status=error`
      };

      // Initiate payment with ArifPay
      const response = await fetch('https://asremenaapp.onrender.com/api/donations/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (result.redirectUrl) {
        // Redirect to ArifPay payment page
        window.location.href = result.redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!donationData) {
    return <p style={styles.error}>Missing donation data. Please return to the form.</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Confirm Your Donation</h2>
        <ul style={styles.list}>
          <li><strong>Name:</strong> {donationData.name}</li>
          <li><strong>Amount:</strong> {donationData.amount} Birr</li>
          <li><strong>Payment Method:</strong> {donationData.partner?.name}</li>
          <li><strong>{donationData.partner?.input}:</strong> {donationData.inputValue}</li>
        </ul>

        <button 
          style={styles.button} 
          onClick={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : '✅ Confirm and Pay with ArifPay'}
        </button>
      </div>
    </div>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'left',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #f0a500',
    paddingBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
    fontSize: '16px',
    color: '#555',
  },
  button: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#f0a500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  error: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '18px',
    color: 'red',
  },
};

export default SantimPayConfirm;
