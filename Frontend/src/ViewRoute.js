import React, { useEffect, useState } from 'react';
import './ViewRoutes.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

//this component will receive the route name from other component, it will fetch the route data from the server and display it on the map, also receive vehicle location
const ViewRoutes = ({ routeId, vehicleCoordinate, liveLocation }) => {
  const [map, setMap] = useState(null);
  const [routePointsArray, setRoutePointsArray] = useState([[0, 0]]);
  const [routeSelected, setRouteSelected] = useState(false);
  const [locationData, setLocationData] = useState([[0, 0]]);
  const [routeData, setRouteData] = useState(null);
  const [devicePushpin, setDevicePushpin] = useState(null);


  console.log("Route id: ", routeId);
  // Function to fetch route data from the API
  const fetchRouteData = async (routeId) => {
    console.log("Route data requested")
    try {
      const response = await axios.get(`${apiUrl}/routedata/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  useEffect(() => {
    if (routeId) {
      fetchRouteData(routeId)
        .then((data) => {
          console.log("Route data: ", data);
          setRouteData(data);
          setLocationData(data.coords);
        })
        .catch(console.error);
      setRouteSelected(true);
    }
  }, [routeId]);


  window.loadMapModule = async () => {
    GetMap();
  }

  useEffect(() => {
    if (locationData.length > 0) {
      GetMap();
    }
  }, [locationData]);

  const GetMap = () => {
    if (locationData && locationData.length === 0) {
      console.warn('Route data is empty');
      //alert('Error: Route data is empty');
      return;
    }
    const locations = locationData.map(location => new window.Microsoft.Maps.Location(location[0], location[1]));
    let mapOptions = {};
    if (!liveLocation) {
      mapOptions.center = locations[0];
    }

    let _map = new window.Microsoft.Maps.Map(document.getElementById('myMapView'), mapOptions)
    setMap(_map)

    //const locationData = [];

    const line = new window.Microsoft.Maps.Polyline(locations, {
      strokeColor: 'blue',
      strokeThickness: 3,
    });

    _map.entities.push(line);

    const startOptions = {
      color: 'green',
      text: 'S',
    };

    const endOptions = {
      color: 'red',
      text: 'E',
    };

    if (vehicleCoordinate) {
      const vehicleLocation = new window.Microsoft.Maps.Location(vehicleCoordinate[0], vehicleCoordinate[1]);
      const vehiclePushpin = new window.Microsoft.Maps.Pushpin(vehicleLocation, null);
      _map.entities.push(vehiclePushpin);
    };

    const startPushpin = new window.Microsoft.Maps.Pushpin(locations[0], startOptions);
    const endPushpin = new window.Microsoft.Maps.Pushpin(locations[locations.length - 1], endOptions);

    _map.entities.push(startPushpin);
    _map.entities.push(endPushpin);

    let pushpin;

    /* const animatePushpin = async () => {
      for (let i = 0; i < locations.length; i++) {
        const index = _map.entities.indexOf(pushpin);

        if (index !== -1) {
          _map.entities.removeAt(index);
        }

        pushpin = new window.Microsoft.Maps.Pushpin(locations[i], null);
        _map.entities.push(pushpin);

        await sleep(2000);
      }
    };

    animatePushpin(); */
    //repeat every 10 seconds
    setInterval(() => {
      if (liveLocation && map) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Device coordinates:', latitude, longitude);

              const index = _map.entities.indexOf(pushpin);
              if (index !== -1) {
                _map.entities.removeAt(index);
              }
              pushpin = new window.Microsoft.Maps.Pushpin(position.coords, {
                color: 'grey',
                text: 'L',
              });
              _map.entities.push(pushpin);
              _map.center = position.coords;
            },
            (error) => console.error('Error getting device coordinates:', error)
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          liveLocation = false;
        }
      }
    }, 10000);
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div id="myMapView" />
  );
};

export default ViewRoutes;