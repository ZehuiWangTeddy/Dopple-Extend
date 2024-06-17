import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PageSwitcher from './components/PageSwitcher';
import Configuration from './pages/Configuration';
import { FeatureProvider } from './contexts/FeatureContext';

const App = () => {
  return (
    <FeatureProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageSwitcher />} />
          <Route path="/stats" element={<PageSwitcher />} />
          <Route path="/config" element={<Configuration />} />
        </Routes>
      </BrowserRouter>
    </FeatureProvider>
  );
};

export default App;
