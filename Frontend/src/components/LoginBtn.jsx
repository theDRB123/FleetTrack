import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginBtn.css';

const apiUrl = process.env.REACT_APP_API_URL;

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

const LoginBtn = () => {
  const userdata = useUserData();
  const navigate = useNavigate();

  const loginwithgoogle = () => {
    window.open(`${apiUrl}/auth/google/callback`, "_self")
  }
  const logout = () => navigate('/logout');

  return (
    <header className="login">
      <nav className="login-container">
        <div className="login-links">
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

export default LoginBtn;