// src/components/NextPageButton.js
import React from 'react';

const NextPageButton = ({ handleNavigate }) => {
  return (
    <button className="next-page-button" onClick={handleNavigate}>
      Next Page
    </button>
  );
};

export default NextPageButton;
