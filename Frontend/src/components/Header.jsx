import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Header.css';
import Extras from './Extras';

const apiUrl = process.env.REACT_APP_API_URL;

const useUserData = () => {
    const [userdata, setUserdata] = useState({});

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

const Header = () => {
    const userdata = useUserData();
    const extrasRef = useRef(null);

    useEffect(() => {
        if (Object.keys(userdata).length !== 0) {
            extrasRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [userdata]);

    const handleGetStarted = () => {
        if (Object.keys(userdata).length === 0) {
            alert('Please login first');
        } else {
            window.location.href = `${apiUrl}/dashboard`;
        }
    };

    return (
        <div className='header'>
            <div className="sidecontentryt">
                <h2>Track your fleet with ease</h2>
                <p>Monitor your vehicles in real-time and optimize your routes with Fleet-Track.</p>
                <button className='getstr' onClick={handleGetStarted}>Get Started</button>
            </div>
            <div className='header-contents'>
                <h2>Fleet-Track</h2>
            </div>
            <div ref={extrasRef}>
                {/* <Extras /> */}
            </div>
        </div>
    );
};

export default Header;