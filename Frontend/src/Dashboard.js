import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import AddRoute from './AddRoute';
import ViewRoutes from './ViewRoutes';
import VehicleData from './VehicleData';
import './Dashboard.css';

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
    
  return (
    <div className="Dashboard">
      <div className="dashNavbar">
        <h2>Fleet Track</h2>
      </div>
      
      <div className={`slide-menu ${menuOpen ? 'open' : ''}`}>
      <button className="menu-button-open" onClick={toggleMenu}>🡠</button>
      <div className="links-container">
        <Link to="/AddRoute" className="nav-link">Add route</Link>
        <Link to="/ViewRoutes" className="nav-link">Routes</Link>
        <Link to="/VehicleData" className="nav-link">Vehicles</Link>
      </div>
    </div>
    <button className="menu-button" onClick={toggleMenu}>☰</button>
    </div>
  );
}

export default Dashboard;