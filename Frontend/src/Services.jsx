import React from "react";
import "./Services.css";
import serviceimg from "./assets/serviceimg.png";
import Headers from './Navbar';

const Services = () => {
    return (
        <div>
            {/* <div className="dashNavbar"><Headers /></div> */}
            <div className="services-container" style={{ display: "flex", alignItems: "center" }}>
            <div className="services-content">
                <h1>Our Services</h1>
                <p>Our services are designed to help you manage your fleet with ease. We offer a range of features to help you monitor your vehicles in real-time and optimize your routes.</p>
            </div>
            <img src={serviceimg} alt="services" />
        </div>
        </div>
    );
}

export default Services;