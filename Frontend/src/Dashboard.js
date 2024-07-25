import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddRoute from './AddRoute';
import ViewRoutes from './ViewRoutes';
import VehicleData from './VehicleData';
import ViewRoute from './ViewRoute';
import axios from 'axios';
import './Dashboard.css';
import Headers from './Navbar';

const apiUrl = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [tripData, setTripData] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [routeId, setrouteId] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicleCoordinate, setVehicleCoordinate] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [tripVehicleData, setTripVehicleData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [newTrip, setNewTrip] = useState({
    tripId: '',
    vehicleId: '',
    scheduled_date_time: '',
    trip_start_date_time: '',
    trip_end_date_time: '',
    routeName: '',
    driverId: '',
    info: '',
    routeId: '',
    distance_threshold_KM: 0.2,
    time_threshold: 10,
    alert_threshold: 10
  });

  const fetchDriverData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/driverdata`, { withCredentials: true });
        setDriverData(response.data);
    } catch (error) {
        console.error('Error fetching driver data:', error);
    }
  };

  const fetchTripData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tripdata`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };

  const fetchRoutesData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/routenames`, { withCredentials: true });
      setRouteData(response.data);
    } catch (error) {
      console.error("Error fetching route names:", error);
    }
  };

  useEffect(() => {
    fetchTripData().then(setTripData);
  }, []);

  const handleTripClick = (tripId, routeId, vehicleId) => {
    console.log('Trip clicked:', tripId, routeId, vehicleId);
    setSelectedTripId(tripId);
    setrouteId(routeId);
    setVehicleId(vehicleId);
    fetchVehicleData()
      .catch(console.error);
  };

  const fetchVehicleData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicledata`, { withCredentials: true });
      console.log('Vehicle data:', response.data);
      setVehicleData(response.data);

      console.log('Current vehicle ID:', vehicleId);
      const selectedVehicle = response.data.find(vehicle => vehicle.vehicleID === vehicleId);
      if (selectedVehicle) {
        setVehicleCoordinate(selectedVehicle.last_location);
      }
      console.log('Selected vehicle:', selectedVehicle);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  const fetchTripVehicleData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicledata`, { withCredentials: true });
      setTripVehicleData(response.data);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchVehicleData()
        .catch(console.error);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const stringToDate = (date_time) => {
    if (date_time) {
      const date = new Date(date_time);
      return date.toLocaleString();
    }
    return "No details available";
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip({ ...newTrip, [name]: value });
  };

  const handleSaveClick = async () => {
    //get the tripId from the max tripId and increment it by 1
    const maxTripId = Math.max(...tripData.map(trip => trip.tripId));
    const estTime = routeData.find(route => route._id === newTrip.routeId).estimatedTime;

    const newTripData = {
      ...newTrip,
      routeName: routeData.find(route => route._id === newTrip.routeId).name,
      time_threshold: newTrip.time_threshold * 60 * 1000,
      scheduled_date_time: new Date(newTrip.scheduled_date_time).getTime(),
      trip_start_date_time: new Date(newTrip.scheduled_date_time).getTime(),
      trip_end_date_time: new Date(newTrip.scheduled_date_time).getTime() + estTime*1000,
      tripId: maxTripId + 1,
      alert_threshold: newTrip.alert_threshold * 60 * 1000
    };
    console.log('Save new trip:', newTripData);

    try {
      const response = await axios.post(`${apiUrl}/addTripData`, newTripData, { withCredentials: true });
      console.log('Trip saved successfully:', response.data);
      setShowForm(false);
      fetchTripData().then(setTripData); // Refresh trip data after adding new trip
    } catch (error) {
      console.error('Error saving new trip:', error);
    }
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleAddTripClick = () => {
    setShowForm(true);
    fetchDriverData();
    fetchTripVehicleData();
    fetchRoutesData();
  };

  const handleStartStopTripClick = async (tripId, status) => {
    try{
      const response = await axios.post(`${apiUrl}/updateTripStatus`,
        { tripId, tripStatus: status },
        { withCredentials: true } 
      );
      console.log('Trip status updated:', response.data);
      fetchTripData().then(setTripData);
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  }


  return (
    <div className="Dashboard">
      <div className="dashNavbar">
        <Headers />
      </div>

      <div className="listMapContainer">
        <div className="tripOptionsContainer">
          <div className="tripList">
            <h2>Trips:</h2>
            {tripData &&
              tripData.map((trip) => (
                <div
                  key={trip.tripId}
                  className={`tripItem ${selectedTripId === trip._id ? 'selected' : ''}`}
                  onClick={() => handleTripClick(trip._id, trip.routeId, trip.vehicleId)}
                >
                  <span className="tripName">{trip.tripId} {trip.routeName}</span>
                  {selectedTripId === trip._id && (
                    <div className="tripDetails">
                      <p>
                        <strong>Vehicle ID:</strong> {trip.vehicleId}
                      </p>
                      <p>
                        <strong>Driver name:</strong> {trip.driverId}
                      </p>
                      <p>
                        <strong>Extra info:</strong> {trip.info}
                      </p>
                      <p>
                        <strong>Start Time:</strong> {stringToDate(trip.trip_start_date_time)}
                      </p>
                      <p>
                        <strong>End Time:</strong> {stringToDate(trip.trip_end_date_time)}
                      </p>
                      <p>
                        <strong>Status:</strong> {trip.tripStatus}
                      </p>
                      {(trip.tripStatus === "SCHEDULED" || trip.tripStatus === "PENDING") && (
                        <button onClick={() => handleStartStopTripClick(trip._id, "RUNNING")} id='startTripButton'>Start Trip</button>
                      )}
                      {(trip.tripStatus === 'RUNNING') && (
                        <button onClick={() => handleStartStopTripClick(trip._id, "COMPLETED")} id='stopTripButton'>Stop Trip</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="buttonsContainer">
            <button id="addTripBtn" onClick={ handleAddTripClick }>Add Trip</button>
          </div>
          {showForm && (
            <div className="tripForm">
              <label htmlFor="trip_start_date_time">Trip start date time</label>
              <input
                type="datetime-local"
                name="scheduled_date_time"
                value={newTrip.scheduled_date_time}
                onChange={handleInputChange}
                placeholder="Start Time"
              />
              {/* <label htmlFor="trip_end_date_time">Trip end date time</label>
              <input
                type="datetime-local"
                name="trip_end_date_time"
                value={newTrip.trip_end_date_time}
                onChange={handleInputChange}
                placeholder="End Time"
              /> */}
              <select name="driverId" value={newTrip.driverId} onChange={handleInputChange}>
                <option value="">Select Driver</option>
                {
                  driverData && driverData.map((driver) => (
                    <option key={driver._id} value={driver._id}>{driver.name}</option>
                  ))
                }
              </select>
              <select name="vehicleId" value={newTrip.vehicleId} onChange={handleInputChange}>
                <option value="">Select Vehicle</option>
                {
                  tripVehicleData && tripVehicleData.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.vehicleID}</option>
                  ))
                }
              </select>
              <select name="routeId" value={newTrip.routeId} onChange={handleInputChange}>
                <option value="">Select Route</option>
                {
                  routeData && routeData.map((route) => (
                    <option key={route._id} value={route._id}>{route.name}</option>
                  ))
                }
              </select>

              <p><label htmlFor="distance_threshold_KM">Distance Threshold (KM)</label> <input name="distance_threshold_KM" value={newTrip.distance_threshold_KM} onChange={handleInputChange} placeholder="Distance Threshold (KM)" /></p>
              <p><label htmlFor="Time Threshold (Minutes)">Time Threshold (Minutes)</label><input name="time_threshold" value={newTrip.time_threshold} onChange={handleInputChange} placeholder="Time Threshold (Minutes)" /></p>
              <p><label htmlFor="alert_threshold">Alert Threshold (Minutes)</label><input name="alert_threshold" value={newTrip.alert_threshold} onChange={handleInputChange} placeholder="Alert Threshold (Minutes)" /></p>
              <p><label htmlFor="info">Extra info</label><input name="info" value={newTrip.info} onChange={handleInputChange} placeholder="Extra info" /></p>
              <button className="saveButton" onClick={handleSaveClick}>Save</button>
              <button className="cancelButton" onClick={handleCancelClick}>Cancel</button>
            </div>
          )}
        </div>
        <div className="tripMapContainer">
        {routeId && <ViewRoute key={vehicleCoordinate} routeId={routeId} vehicleCoordinate={vehicleCoordinate} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;