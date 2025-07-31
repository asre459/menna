import React, { createContext, useContext, useState } from 'react';

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donationInfo, setDonationInfo] = useState({ name: '', amount: '' });
  return (
    <DonationContext.Provider value={{ donationInfo, setDonationInfo }}>
      {children}
    </DonationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDonation = () => useContext(DonationContext);
