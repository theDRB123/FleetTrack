import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './Dashboard';
import AddRoute from './AddRoute';
import ViewRoutes from './ViewRoutes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AddRoute" element={<AddRoute />} />
        <Route path="/ViewRoutes" element={<ViewRoutes />} />
      </Routes>
    </Router>
  </React.StrictMode>
);