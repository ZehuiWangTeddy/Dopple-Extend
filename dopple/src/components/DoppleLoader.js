import React from 'react';
import "./DoppleLoader.css";

const DoppleLoader = () => {
  return (
    <div className="spinner">
        <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  )
};

export default DoppleLoader;