import React from 'react'
import './SideBar.css'
import { NavLink } from 'react-router-dom'
import Home from '../assets/home.png'
import about from '../assets/about.webp'
import contact from '../assets/contacts.png'
import services from '../assets/services.png'
import LoginBtn from './LoginBtn'
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-header'>
                <h1>FleetTrack</h1>
            </div>
            <div className="sidebar-options">
                <NavLink to='/home' className="sidebar-option">
                    <img src={Home} alt="FleetTrack" />
                    <p>Home</p>
                </NavLink>
                <NavLink to='/about' className="sidebar-option">
                    <img src={about} alt="FleetTrack" />
                    <p>About</p>
                </NavLink>
                <NavLink to='/contact' className="sidebar-option">
                    <img src={contact} alt="FleetTrack" />
                    <p>Contact</p>
                </NavLink>
                <NavLink to='/services' className="sidebar-option">
                    <img src={services} alt="FleetTrack" />
                    <p>Services</p>
                </NavLink>
                
            </div>
        </div>
    )
}

export default Sidebar
