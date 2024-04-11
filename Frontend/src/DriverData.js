import React, { useEffect, useState } from 'react';
import './DriverData.css'; // Import your CSS file for driver data styling
import axios from 'axios';

const DriverData = () => {
    const [driverData, setDriverData] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: '', mobile: '' });

    useEffect(() => {
        fetchDriverData();
    }, []);

    useEffect(() => {
        const form = document.querySelector('.driverForm');
        if (form) {
          form.style.transform = showForm ? 'translateY(0)' : 'translateY(100%)';
        }
    }, [showForm]);

    const fetchDriverData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/driverdata');
            console.log(response.data)
            setDriverData(response.data);
        } catch (error) {
            console.error('Error fetching driver data:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (showForm && !document.querySelector('.driverForm').contains(event.target)) {
            setShowForm(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [showForm]);

    const handleDriverClick = (driver) => {
        setSelectedDriver(driver);
    };

    const handleInputChange = (event) => {
        setNewDriver({ ...newDriver, [event.target.name]: event.target.value });
    };

    const handleSaveClick = async () => {
        if (!newDriver.name || !newDriver.mobile) {
            alert('Name and Mobile cannot be empty');
            return;
        }
        try {
            await axios.post('http://localhost:4000/addDriver', newDriver);
            await fetchDriverData();
        } catch (error) {
            if (error.response.status === 400) {
                alert('Driver already exists');
            }
            console.error('Error adding driver', error);
        }
        setNewDriver({ name: '', mobile: '' });
        setShowForm(false);
    };

    const handleAddDriverClick = (event) => {
        event.stopPropagation();
        setShowForm(true);
    };

    return (
        <div className="driverData">
            <div className="driverDataContainer">
                <h2>Driver Data</h2>
                <div className="driverList">
                    {driverData && driverData.map((driver, index) => (
                        <div key={index} className={`driverItem ${selectedDriver && selectedDriver.name === driver.name ? 'selected' : ''}`} onClick={() => handleDriverClick(driver)}>
                            <span className="driverName">{driver.name}</span>
                            {selectedDriver && selectedDriver.name === driver.name && (
                                <div className="driverDetails">
                                    <p><strong>Mobile:</strong> {driver.mobileNumber}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="buttonsContainer">
                    <button id="addDriverBtn" onClick={handleAddDriverClick}>Add Driver</button>
                </div>
                {showForm && (
                    <div className="driverForm">
                        <input name="name" value={newDriver.name} onChange={handleInputChange} placeholder="Driver Name" />
                        <input name="mobile" value={newDriver.mobile} onChange={handleInputChange} placeholder="Mobile Number" />
                        <button onClick={handleSaveClick}>Save</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverData;