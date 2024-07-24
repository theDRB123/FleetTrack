import React, { useState } from 'react';
import './Hamburger.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const Hamburger = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={menuOpen ? "hline hline1" : "hline"}></div>
        <div className={menuOpen ? "hline hline2" : "hline"}></div>
        <div className={menuOpen ? "hline hline3" : "hline"}></div>
      </div>
      <div className={`slide-menu ${menuOpen ? 'open' : ''}`}>
        <button className="menu-button-open" onClick={toggleMenu}>🡠</button>
        <div className="links-container">
          <Link to="/AddRoute" className="nav-link">Add route</Link>
          <Link to="/ViewRoutes" className="nav-link">Routes</Link>
          <Link to="/VehicleData" className="nav-link">Vehicles</Link>
          <Link to="/DriverData" className="nav-link">Drivers</Link>
        </div>
      </div>
    </div>
  );
};

export default Hamburger;