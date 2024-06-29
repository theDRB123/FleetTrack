import React from "react";
import './About.css';
import { NavLink } from 'react-router-dom';

const About = () => {
    return (
        <div className="about">
        <h2>About FleetTrack</h2>
        <p>FleetTrack is a fleet management system that helps businesses manage their vehicles and drivers. Our software provides real-time tracking, route optimization, and analytics to help you make data-driven decisions.</p>
        <p>With FleetTrack, you can monitor your fleet's performance, reduce costs, and improve customer satisfaction. Our platform is easy to use and customizable to meet your business needs.</p>
        <p>Get started with FleetTrack today and take your fleet management to the next level!</p>
        <NavLink to="/services" className="about-button">Learn More</NavLink>
        </div>
    );
    }

export default About;