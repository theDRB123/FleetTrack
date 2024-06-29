import React from "react";
import './About.css';
import { NavLink } from 'react-router-dom';
import fleetTrackLogo from '../assets/aboutimg.avif';

const About = () => {
    return (
        <div className="about">
        <img src={fleetTrackLogo} alt="FleetTrack Logo" className="about-logo" />
        {/* <h2>About FleetTrack</h2> */}
        <p><b>Welcome to FleetTrack, your all-in-one fleet management solution!</b></p>
        <p>FleetTrack is a fleet management system that helps businesses manage their vehicles and drivers. Our software provides real-time tracking, route optimization, and analytics to help you make data-driven decisions.
        With FleetTrack, you can monitor your fleet's performance, reduce costs, and improve customer satisfaction. Our platform is easy to use and customizable to meet your business needs.
        Get started with FleetTrack today and take your fleet management to the next level!</p>
        <NavLink to="/services" className="about-button">Learn More</NavLink>
        </div>
    );
}

export default About;