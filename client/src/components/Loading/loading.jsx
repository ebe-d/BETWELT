import React from 'react';
import './loading.css';

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p className="loading-text">LOADING</p>
    </div>
  );
}

export default Loading;
