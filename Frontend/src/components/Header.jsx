import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className="sidecontentryt">
                <h2>Track your fleet with ease</h2>
                <p>Monitor your vehicles in real-time and optimize your routes with Fleet-Track.</p>
                <button className='getstr' onClick={() => window.location.href='/services'}>Get Started</button>
            </div>
            <div className='header-contents'>
                <h2>Fleet-Track</h2>
            </div>
        </div>
    )
}

export default Header