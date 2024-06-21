// src/components/ConfigPageButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigPageButton = () => {
const navigate = useNavigate();

const handleNavigate = () => {
navigate('/config');
};

return (
<button className="next-page-button" onClick={handleNavigate}>
Configuration Page
</button>
);
};

export default ConfigPageButton;