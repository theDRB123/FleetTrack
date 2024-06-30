import React, { useState } from 'react';
import './Hamburger.css';

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isOpen ? "line line1" : "line"}></div>
        <div className={isOpen ? "line line2" : "line"}></div>
        <div className={isOpen ? "line line3" : "line"}></div>
      </div>
      {isOpen && (
        <div className="menu-list">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">Resources</a></li>
            <li><a href="#services">Custumer-Support</a></li>
            <li><a href="#contact">Complain</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Hamburger;