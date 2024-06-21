import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FirstPage from '../pages/FirstPage';
import SecondPage from '../pages/SecondPage';
import Configuration from '../pages/Configuration';
import PageSwitcher from './PageSwitcher';

const MainContainer = () => {
const location = useLocation();
const navigate = useNavigate();

const handleNavigate = (page) => {
navigate(page === 1 ? '/' : page === 2 ? '/stats' : '/config');
};

return (
<div>
<div style={{ display: location.pathname === '/' ? 'block' : 'none' }}>
<FirstPage handleNavigate={handleNavigate} />
</div>
<div style={{ display: location.pathname === '/stats' ? 'block' : 'none' }}>
<SecondPage handleNavigate={handleNavigate} />
</div>
<div style={{ display: location.pathname === '/config' ? 'block' : 'none' }}>
<Configuration />
</div>
<PageSwitcher />
</div>
);
};

export default MainContainer;