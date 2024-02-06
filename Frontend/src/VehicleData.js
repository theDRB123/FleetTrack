import React, { useEffect, useState } from 'react';
import './VehicleData.css';
import axios from 'axios';
import randomColor from 'randomcolor';

const VehicleData = () => {
  const [map, setMap] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleCoordinate, setVehicleCoordinate] = useState(null);
  const [showAll, setShowAll] = useState(false);
  
  const fetchVehicleData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/vehicledata');
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
    }
    };

    useEffect(() => {
        fetchVehicleData()
            .then((data) => {
                console.log("Vehicle data: ", data);
                setVehicleData(data);
            })
            .catch(console.error);
    }, []);

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setVehicleCoordinate([vehicle.last_location[0], vehicle.last_location[1]]);
        setShowAll(false);
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

    if(showAll && vehicleData)
    {
        vehicleData.forEach((vehicle, index) => {
            if(vehicle.last_location.length > 0)
            {
                const vehicleLocation = new window.Microsoft.Maps.Location(vehicle.last_location[0], vehicle.last_location[1]);
                const vehiclePushpin = new window.Microsoft.Maps.Pushpin(vehicleLocation, { title: vehicle.vehicle_id, color: randomColor()});
                _map.entities.push(vehiclePushpin);
            }
        });
    }
    else if(vehicleCoordinate && selectedVehicle && selectedVehicle.last_location.length > 0) {
      const vehicleLocation = new window.Microsoft.Maps.Location(vehicleCoordinate[0], vehicleCoordinate[1]);
      const vehiclePushpin = new window.Microsoft.Maps.Pushpin(vehicleLocation, { title: selectedVehicle.vehicle_id });
      _map.entities.push(vehiclePushpin);
      _map.setView({ center: vehicleLocation });
    };
  }

  return (
    <div className= "vehicleData">
        <div className="vehicleDataContainer">
            <h2>Vehicle Data</h2>
            <div className="vehicleList">
                {vehicleData && vehicleData.map((vehicle) => (
                    vehicle && <div key={vehicle.vehicle_id} className={`vehicleItem ${selectedVehicle && selectedVehicle.vehicle_id === vehicle.vehicle_id ? 'selected' : ''}`} onClick={() => handleVehicleClick(vehicle)}>
                        <span className="vehicleName">{vehicle.vehicle_id}</span>
                        {selectedVehicle && selectedVehicle.vehicle_id === vehicle.vehicle_id && (
                            <div className="vehicleDetails">
                                <p><strong>Location:</strong> {vehicle.last_location[0]}, {vehicle.last_location[1]}</p>
                                <p><strong>Max load:</strong> {vehicle.max_load}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button id='showAllBtn' onClick={() => setShowAll(!showAll)}>{showAll ? 'Hide All' : 'Show All'}</button>
        </div>
        <div className="vehicleDataMapContainer">
            <div id="myMapView"/>
        </div>
    </div>
  );
};

export default VehicleData;