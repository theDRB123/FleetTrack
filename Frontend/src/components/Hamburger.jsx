// import React, { useState } from 'react';
// import './Hamburger.css';

// const Hamburger = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="hamburger-menu">
//       <div className="menu-icon" onClick={toggleMenu}>
//         <div className={isOpen ? "line line1" : "line"}></div>
//         <div className={isOpen ? "line line2" : "line"}></div>
//         <div className={isOpen ? "line line3" : "line"}></div>
//       </div>
//       {isOpen && (
//         <div className="menu-list">
//           <ul>
//             <li><a href="#home">Home</a></li>
//             <li><a href="#about">Resources</a></li>
//             <li><a href="#services">Custumer-Support</a></li>
//             <li><a href="#contact">Complain</a></li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Hamburger;





import React, { useState } from 'react';
import './Hamburger.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleBackButton = () => {
    setIsOpen(false);
  };

  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isOpen ? "line line1" : "line"}></div>
        <div className={isOpen ? "line line2" : "line"}></div>
        <div className={isOpen ? "line line3" : "line"}></div>
      </div>
      {isOpen && (
        <div className="slide-menu open">
          <div className="links-container">
            <button className="back-button" onClick={handleBackButton}>
              <FontAwesomeIcon icon={'<--'} /> {'close'}
            </button>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/services" className="nav-link">Resources</Link></li>
              <li><Link to="/contact" className="nav-link">Costumer-Support</Link></li>
              <li><Link to="/contact" className="nav-link">Complain</Link></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hamburger;