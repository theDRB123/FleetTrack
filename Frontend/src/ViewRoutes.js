import React, { useEffect, useState } from 'react';
import ViewRoute from './ViewRoute'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import axios from 'axios';

const ViewRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch the route names from the server
  useEffect(() => {
    fetchRoutes().then(setRoutes);
  }, []);

  // Fetch the route data when a route name is clicked
  const handleRouteClick = (routeName) => {
    setSelectedRoute(routeName);
    //send the route name to ViewRoute component
  };

  // Function to fetch route names from the API
  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/routenames');
      return response.data;
    } catch (error) {
      console.error('Error fetching route names:', error);
    }
  };

  return (
    <div>
      <ul>
        {routes && routes.map(route => (
          <li key={route} onClick={() => handleRouteClick(route)}>
            {route}
          </li>
        ))}
      </ul>
      {selectedRoute && <ViewRoute key={selectedRoute} routeName={selectedRoute} />}
    </div>
  );
};

export default ViewRoutes;