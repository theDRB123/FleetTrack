import React, { useEffect, useState } from 'react';
import './DriverData.css';
import axios from 'axios';
import { set } from 'mongoose';

const DriverData = () => {
    const [driverData, setDriverData] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newDriver, setNewDriver] = useState({_id: '', name: '', mobile: '', info: ''});
    const [updateForm, setUpdateForm] = useState(false);

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
            const response = await axios.get('http://localhost:4000/driverdata', { withCredentials: true });
            console.log(response.data)
            setDriverData(response.data);
        } catch (error) {
            console.error('Error fetching driver data:', error);
        }
    };

    const handleAddDriverClick = (event) => {
        // event.stopPropagation();
        setShowForm(true);
    };

    //update driver
    const handleUpdateClick = (driver) => {
        setNewDriver( { _id: driver._id, name: driver.name, mobile: driver.mobileNumber, info: driver.info });
        setUpdateForm(true);
        setShowForm(true);
    };

    //delete driver
    const deleteDriver = async (driverId) => {
        try {
            await axios.post('http://localhost:4000/deleteDriver',
            { driverId },
            { withCredentials: true });

            await fetchDriverData();
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };

    //handle delete button click
    const handleDeleteClick = (driverId) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            deleteDriver(driverId);
        }
    }

    /* useEffect(() => {
        const handleClickOutside = (event) => {
          if (showForm && !document.querySelector('.driverForm').contains(event.target)) {
            // setShowForm(false);
            // setUpdateForm(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [showForm]); */

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
            if(updateForm)
            {
                await axios.post('http://localhost:4000/updateDriver', newDriver, { withCredentials: true });
            }
            else
            {
                await axios.post('http://localhost:4000/addDriver', newDriver, { withCredentials: true });
            }
            await fetchDriverData();
        } catch (error) {
            if (error.response.status === 400) {
                alert('Driver already exists');
            }
            console.error('Error adding driver', error);
        }
        setNewDriver({_id: '', name: '', mobile: '', info: '' });
        setShowForm(false);
        setUpdateForm(false);
    };

    const handleCancelClick = () => {
        setShowForm(false);
        setUpdateForm(false);
        setNewDriver({_id: '', name: '', mobile: '', info: '' });
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
                                    <p><strong>Extra info:</strong> {driver.info}</p>
                                    <p>
                                        <button onClick={() => handleUpdateClick(driver)}>Edit</button>
                                        <button onClick={() => handleDeleteClick(driver._id)}>Delete</button>
                                    </p>
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
                        <input name="info" value={newDriver.info} onChange={handleInputChange} placeholder="Extra info" />
                        <button onClick={handleSaveClick}>Save</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverData;