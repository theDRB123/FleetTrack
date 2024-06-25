import React from 'react';
import './Header.css';
import headerImg from '../assets/headerimg.jpg';

const Header = () => {
  return (
    <div className='header'>
      
      <img src={headerImg} alt="" />
      <div className='header-contents'>
        <h2>Fleet-Track</h2>
      </div>
    </div>
  );
}

export default Header;