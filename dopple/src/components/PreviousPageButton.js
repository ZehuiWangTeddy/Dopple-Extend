// src/components/PreviousPageButton.js
import React from 'react';

const PreviousPageButton = ({ handleNavigate }) => {
  return (
    <button className="previous-page-button" onClick={handleNavigate}>
      Previous Page
    </button>
  );
};

export default PreviousPageButton;
