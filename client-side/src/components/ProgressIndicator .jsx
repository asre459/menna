import React from 'react';
import '../ProgressIndicator.css'; // Optional if you want to style it

function ProgressIndicator() {
  return (
    <div className="progress-indicator">
      <p>Processing your donation...</p>
      <div className="spinner" />
    </div>
  );
}

export default ProgressIndicator;
