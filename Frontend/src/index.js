import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './Dashboard';
import AddRoute from './AddRoute';
import ViewRoutes from './ViewRoutes';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));

const loadScript = () => {
  let script = document.createElement("script");
  script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=loadMapModule&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l`);
  document.body.appendChild(script);
}



loadScript()

root.render(
  // <StrictMode>
  // <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AddRoute" element={<AddRoute />} />
        <Route path="/ViewRoutes" element={<ViewRoutes />} />
      </Routes>
    </Router>
    // {/* </ErrorBoundary> */}
  // </StrictMode>
);