import React from 'react';
import { Link } from 'react-router-dom';
import AddRoute from './AddRoute';
import ViewRoutes from './ViewRoutes';
import './App.css';

function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="navbar">
        <Link to="/AddRoute" className="nav-link">Add route</Link>
        <Link to="/ViewRoutes" className="nav-link">View routes</Link>
      </div>
    </div>
  );
}

export default Dashboard;