// src/Components/SmallDeviceWarning/SmallDeviceWarning.jsx
import React from 'react';
import './SmallDeviceWarning.css';

const SmallDeviceWarning = () => {
  return (
    <div className="small-device-warning-container">
      <div className="small-device-warning-content">
      <svg className="construction-icon" viewBox="0 0 24 24" width="60" height="60">
          <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5z" />
          <path d="M11 10h2v5h-2z" />
          <circle cx="12" cy="17" r="1" />
        </svg>
        <h1>Page Under Construction</h1>
        <p>This application is currently under construction for smaller devices.</p>
        <p>Please view it on a desktop device for the best experience.</p>
      </div>
    </div>
  );
};

export default SmallDeviceWarning;