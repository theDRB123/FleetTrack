import React, { useEffect, useState } from 'react';
import './ViewRoutes.css';
import axios from 'axios';

//this component will receive the route name from other component, it will fetch the route data from the server and display it on the map
const ViewRoutes = ({ routeName }) => {
  const [map, setMap] = useState(null);
  const [routePointsArray, setRoutePointsArray] = useState([[0, 0]]);
  const [routeSelected, setRouteSelected] = useState(false);
  const [locationData, setLocationData] = useState([[0, 0]]);

  console.log("Route name: ", routeName);
  // Function to fetch route data from the API
  const fetchRouteData = async (routeName) => {
    console.log("Route data requested")
    try {
      const response = await axios.get(`http://localhost:4000/routedata/${routeName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  useEffect(() => {
    if (routeName) {
      fetchRouteData(routeName)
        .then(setLocationData)
        .catch(console.error);
      setRouteSelected(true);
    }
  }, [routeName]);
    

  window.loadMapModule = async () => {
    GetMap();
  }

  const GetMap = () => {
    let _map = new window.Microsoft.Maps.Map(document.getElementById('myMapView'), {});
    setMap(_map)

    //const locationData = [];

    const locations = locationData.map(location => new window.Microsoft.Maps.Location(location[0], location[1]));

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
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://www.bing.com/api/maps/mapcontrol?key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l&callback=loadMapModule';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="myMapView"/>
  );
};

export default ViewRoutes;