import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import Hamburger from './components/Hamburger';

const useUserData = () => {
  const [userdata, setUserdata] = useState({});
  console.log("response",userdata);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/login/success', { withCredentials: true });
        setUserdata(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, []);

  return userdata;
};

const Navbar = () => {
  const userdata = useUserData();
  const navigate = useNavigate();

  const loginwithgoogle = () => {
    window.open("http://localhost:4000/auth/google/callback","_self")
}
const logout = ()=>{
  window.open("http://localhost:4000/logout","_self")
}

  return (
    <header className="navbar">
      <nav className="navbar-container">
      <Hamburger />
        <div className="navbar-brand">
          <h1>FleetTrack</h1>
        </div>
        <div className="navbar-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
          <NavLink to="/services" className="nav-link">Services</NavLink>
          {Object.keys(userdata).length > 0 ? (
            <>
              <span className="nav-user">{userdata.displayName}</span>
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
              <button onClick={logout} className="nav-button">Logout</button>
              <img src={userdata.image} className="nav-user-image" alt="User" />
            </>
          ) : (
            <button onClick={loginwithgoogle} className="nav-button">Login</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;