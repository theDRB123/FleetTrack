import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import Hamburger from './components/Hamburger';
// import { FaBars } from 'react-icons/fa';
const apiUrl = process.env.REACT_APP_API_URL;
console.log("apiUrl", apiUrl);
const useUserData = () => {
  const [userdata, setUserdata] = useState({});
  console.log("response", userdata);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
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
    window.open(`${apiUrl}/auth/google/callback`, "_self")
  }
  const logout = () => {
    window.open(`${apiUrl}/logout`, "_self")
  }

  return (
    <header className="navbar">
      <nav className="navbar-container">
      {Object.keys(userdata).length == 0 ? (<Hamburger />) : null}
        <div className="navbar-brand">
          <h1>FleetTrack</h1>
        </div>
        <div className="navbar-links">
          <a href="" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#services" className="nav-link">Services</a>
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