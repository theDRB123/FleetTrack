import React from 'react'
import './Footer.css'
import headerImg from '../assets/headerimg.jpg'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                <img src={headerImg} alt="icon" />
                    <p>
                        FleetTrack is a fleet management system that allows you to track your vehicles in real-time.
                        It is a user-friendly system that provides you with all the information you need to manage your fleet effectively.
                    </p>
                </div>
                <div className="footer-content-center">
                    <h2>FleetTrack</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+123-1004762738</li>
                        <li>contact@fleettrack.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 © fleettrack.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
