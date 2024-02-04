import React, { useEffect, useState } from "react";
import ViewRoute from "./ViewRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

const ViewRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch the route names from the server
  useEffect(() => {
    fetchRoutes().then(setRoutes);
  }, []);

  // Fetch the route data when a route name is clicked
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    //send the route name to ViewRoute component
  };

  // Function to fetch route names from the API
  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/routenames");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching route names:", error);
    }
  };

  //convert seconds to hours and minuts
  const convertToHoursAndMinutes = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${hours > 0 ? hours + " hours " : ""}${
      minutes > 0 ? minutes + " minutes " : ""
    }`;
  };

  return (
    <div className="viewRoutes">
      <div className="routesContainer">
        <h2>Routes</h2>
        <ul>
        {routes && routes.map((route) => (
            <li key={route.name} onClick={() => handleRouteClick(route)}>
              {route.name}
              {selectedRoute && selectedRoute.name === route.name && (
                <div>
                  <ul>
                    <li>Distance: {route.distance} km</li>
                    <li>
                      Estimated Time:{" "}
                      {convertToHoursAndMinutes(route.estimatedTime)}
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
      </ul>
      </div>
      <div className="mapContainer">
        { selectedRoute && <ViewRoute routeName={selectedRoute.name} />}
      </div>
    </div>
  );
};

export default ViewRoutes;