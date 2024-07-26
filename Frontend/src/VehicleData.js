import React, { useEffect, useState } from 'react';
import './VehicleData.css';
import axios from 'axios';
import randomColor from 'randomcolor';
import Headers from './Navbar';

const VehicleData = () => {
    const [map, setMap] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleCoordinate, setVehicleCoordinate] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ vehicleID: '', max_load: '', last_location: [], last_location_date_time: '', info: '' });

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const form = document.querySelector('.vehicleForm');
        if (form) {
            form.style.transform = showForm ? 'translateY(0)' : 'translateY(100%)';
        }
    }, [showForm]);

    /* useEffect(() => {
        const handleClickOutside = (event) => {
          if (showForm && !document.querySelector('.vehicleForm').contains(event.target)) {
            setShowForm(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [showForm]); */

    const handleAddVehicleClick = (event) => {
        // event.stopPropagation(); // Prevent the click event from reaching the document
        setShowForm(true);
    };

    const handleInputChange = (event) => {
        setNewVehicle({ ...newVehicle, [event.target.name]: event.target.value });
    };

    const handleSaveClick = async () => {
        if (!newVehicle.vehicleID || !newVehicle.max_load) {
            alert('Vehicle ID and Max Load cannot be empty');
            return;
        }
        try {
            if (updateForm) {
                await axios.post(`${apiUrl}/updateVehicle`, newVehicle, { withCredentials: true });
            }
            else {
                await axios.post(`${apiUrl}/addVehicle`, newVehicle, { withCredentials: true });
            }
            await fetchVehicleData();
        } catch (error) {
            if (error.response.status === 400) {
                alert('Vehicle already exists');
            }
            console.error('Error adding vehicle', error);
        }
        setNewVehicle({ vehicleID: '', max_load: '', last_location: [], last_location_date_time: '' });
        setShowForm(false);
        setUpdateForm(false);
    };

    const fetchVehicleData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/vehicledata`, { withCredentials: true });
            setVehicleData(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle data:', error);
        }
    };

    useEffect(() => {
        fetchVehicleData()
            .catch(console.error);
    }, []);

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setVehicleCoordinate([vehicle.last_location[0], vehicle.last_location[1]]);
        setShowAll(false);
    };

    //delete vehicle
    const deleteVehicle = async (vehicleId) => {
        try {
            await axios.post(`${apiUrl}/deleteVehicle`,
                { vehicleId },
                { withCredentials: true });

            await fetchVehicleData();
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };

    const handleUpdateClick = (vehicle) => {
        setNewVehicle({ _id: vehicle._id, vehicleID: vehicle.vehicleID, max_load: vehicle.max_load, info: vehicle.info });
        setUpdateForm(true);
        setShowForm(true);
    };

    //handle delete button click
    const handleDeleteClick = (vehicleId) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            deleteVehicle(vehicleId);
        }
    }

    const handleCancelClick = () => {
        setShowForm(false);
        setUpdateForm(false);
        setNewVehicle({ _id: '', vehicleID: '', max_load: '', last_location: [], last_location_date_time: '', info: '' });
    };

    window.loadMapModule = async () => {
        GetMap();
    }

    useEffect(() => {
        if (vehicleData && vehicleData.length > 0) {
            GetMap();
        }
    }, [vehicleCoordinate, showAll]);

    const GetMap = () => {
        if (vehicleData && vehicleData.length === 0) {
            console.warn('No vehicles');
            alert('Error: No vehicles');
            return;
        }
        let _map = new window.Microsoft.Maps.Map(document.getElementById('myMapView'), {
            if(vehicleCoordinate) {
                center: new window.Microsoft.Maps.Location(vehicleCoordinate[0], vehicleCoordinate[1])
            }
        });
        setMap(_map)

        if (showAll && vehicleData) {
            vehicleData.forEach((vehicle, index) => {
                if (vehicle.last_location.length > 0) {
                    const vehicleLocation = new window.Microsoft.Maps.Location(vehicle.last_location[0], vehicle.last_location[1]);
                    const vehiclePushpin = new window.Microsoft.Maps.Pushpin(vehicleLocation, { title: vehicle.vehicleID, color: randomColor() });
                    _map.entities.push(vehiclePushpin);
                }
            });
        }
        else if (vehicleCoordinate && selectedVehicle && selectedVehicle.last_location.length > 0) {
            const vehicleLocation = new window.Microsoft.Maps.Location(vehicleCoordinate[0], vehicleCoordinate[1]);
            const vehiclePushpin = new window.Microsoft.Maps.Pushpin(vehicleLocation, { title: selectedVehicle.vehicleID });
            _map.entities.push(vehiclePushpin);
            _map.setView({ center: vehicleLocation });
        };
    }

    const stringToDate = (date_time) => {
        if (date_time) {
            const date = new Date(date_time);
            return date.toLocaleString();
        }
        return "No details available";
    }


    return (
        <> <Headers />
            <div className="vehicleData">
                <div className="vehicleDataContainer">
                    <h2>Vehicle Data</h2>
                    <div className="vehicleList">
                        {vehicleData && vehicleData.map((vehicle) => (
                            vehicle && <div key={vehicle.vehicleID} className={`vehicleItem ${selectedVehicle && selectedVehicle.vehicleID === vehicle.vehicleID ? 'selected' : ''}`} onClick={() => handleVehicleClick(vehicle)}>
                                <span className="vehicleName">{vehicle.vehicleID}</span>
                                {selectedVehicle && selectedVehicle.vehicleID === vehicle.vehicleID && (
                                    <div className="vehicleDetails">
                                        <p><strong>Location:</strong> {vehicle.last_location && vehicle.last_location.length > 0 ? `${vehicle.last_location[0]}, ${vehicle.last_location[1]}` : 'No details available'}</p>
                                        <p><strong>Max load:</strong> {vehicle.max_load}</p>
                                        <p><strong>Extra info:</strong> {vehicle.info} </p>
                                        <p><strong>Last Location Date and Time:</strong> {stringToDate(vehicle.last_location_date_time)}</p>
                                        <p><strong>Password:</strong> {vehicle.password}</p>
                                        <p>
                                            <button onClick={() => handleUpdateClick(vehicle)}>Edit</button>
                                            <button onClick={() => handleDeleteClick(vehicle._id)}>Delete</button>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="buttonsContainer">
                        <button id='showAllBtn' onClick={() => setShowAll(!showAll)}>{showAll ? 'Hide All' : 'Show All'}</button>
                        <button id='addVehicleBtn' onClick={handleAddVehicleClick}>Add Vehicle</button>
                    </div>
                    {showForm && (
                        <div className="vehicleForm">
                            <input name="vehicleID" value={newVehicle.vehicleID} onChange={handleInputChange} placeholder="Vehicle ID" />
                            <input name="max_load" value={newVehicle.max_load} onChange={handleInputChange} placeholder="Max Load" />
                            <input name="info" value={newVehicle.info} onChange={handleInputChange} placeholder="Extra info" />
                            <button onClick={handleSaveClick} className="saveButton">Save</button>
                            <button onClick={handleCancelClick} className="cancelButton">Cancel</button>
                        </div>
                    )}
                </div>
                <div className="vehicleDataMapContainer">
                    <div id="myMapView" />
                </div>
            </div>
        </>
    );
};

export default VehicleData;