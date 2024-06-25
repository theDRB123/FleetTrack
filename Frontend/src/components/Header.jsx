import React from 'react';
import './Header.css';
import LoginBtn from './LoginBtn';
import headerImg from '../assets/headerimg.jpg';

const Header = () => {
  return (
    <div className='header'>
      <div className="login">
        <LoginBtn />
      </div>
      <img src={headerImg} alt="" />
      <div className='header-contents'>
        <h2>Fleet-Track</h2>
      </div>
    </div>
  );
}

export default Header;