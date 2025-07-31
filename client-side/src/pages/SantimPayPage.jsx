import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SantimPayPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state.name || !state.amount) {
      alert('Missing payment details.');
      navigate('/donate');
      return;
    }

    // Simulate call to backend or SANTIMPay API
    console.log('Initiating payment with:', state);

    // Simulate success (replace with real integration)
    setTimeout(() => {
      alert('Payment successful! Thank you.');
      navigate('/donate'); // or a confirmation page
    }, 3000);
  }, [state, navigate]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-semibold text-[#d3af35]">Processing Payment...</h1>
      <p className="text-gray-600 mt-4">Name: {state?.name}</p>
      <p className="text-gray-500">Amount: {state?.amount} Birr</p>

      <div className="mt-6 animate-pulse">
        <p className="text-sm text-gray-500">Connecting to SANTIMPay...</p>
      </div>
    </div>
  );
}

export default SantimPayPage;
