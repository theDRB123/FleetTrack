import React from "react";
import './About.css';
import { NavLink } from 'react-router-dom';
import fleetTrackLogo from './assets/aboutimg.avif';
import Headers from './Navbar';

const About = () => {
    return (
        <div>
            {/* <div className="dashNavbar"><Headers /></div> */}
            <div className="about" id="about">
                <img src={fleetTrackLogo}></img>
                <p className="aboutTitle aboutContent"><b>Welcome to FleetTrack, your all-in-one fleet management solution!</b></p>
                <p className="aboutbody aboutContent">FleetTrack is a fleet management system that helps businesses manage their vehicles and drivers. Our software provides real-time tracking, route optimization, and analytics to help you make data-driven decisions.
                With FleetTrack, you can monitor your fleet's performance, reduce costs, and improve customer satisfaction. Our platform is easy to use and customizable to meet your business needs.
                Get started with FleetTrack today and take your fleet management to the next level!</p>
                <NavLink to="/services" className="about-button">Learn More</NavLink>
            </div>
        </div>
    );
}

export default About;