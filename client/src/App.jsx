// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './suby/pages/LandingPage';
import ProductMenu from './suby/components/ProductMenu';
import { AppProvider } from './suby/AppContext';

const App = () => (
  <AppProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products/:firmId/:firmName" element={<ProductMenu />} />
    </Routes>
  </AppProvider>
);

export default App;
