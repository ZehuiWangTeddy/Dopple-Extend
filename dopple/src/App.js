import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainContainer from './components/MainContainer';
import { FeatureProvider } from './contexts/FeatureContext';

const App = () => {
  return (
    <FeatureProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainContainer />} />
        </Routes>
      </BrowserRouter>
    </FeatureProvider>
  );
};

export default App;
