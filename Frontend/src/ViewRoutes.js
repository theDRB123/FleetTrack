import React, { useEffect, useState } from "react";
import ViewRoute from "./ViewRoute";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Headers from "./Navbar";

const apiUrl = process.env.REACT_APP_API_URL;

const ViewRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch the route names from the server
  useEffect(() => {
    fetchRoutes().then(setRoutes);
    setSelectedRoute(routes[0])
  }, []);

  // Fetch the route data when a route name is clicked
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    //send the route name to ViewRoute component
  };

  // Function to fetch route names from the API
  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/routenames`, { withCredentials: true });
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
    return `${hours > 0 ? hours + " hours " : ""}${minutes > 0 ? minutes + " minutes " : ""
      }`;
  };

  return (
    <>
      <Headers />
      <div className="viewRoutes">
        <div className="routesContainer">
          <h2>Routes</h2>
          <div className="routeList">
            {routes && routes.map((route) => (
              <div key={route.name} className={`routeItem ${selectedRoute && selectedRoute.name === route.name ? 'selected' : ''}`} onClick={() => handleRouteClick(route)}>
                <span className="routeName">{route.name}</span>
                {selectedRoute && selectedRoute.name === route.name && (
                  <div className="routeDetails">
                    <p><strong>Distance:</strong> {route.distance} km</p>
                    <p><strong>Estimated Time:</strong> {convertToHoursAndMinutes(route.estimatedTime)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div class="routeButtons">
            <button id="addRoute" onClick={() => navigate('/AddRoute')}>Add Route</button>
          </div>
        </div>

        <div className="viewMapContainer">
          {selectedRoute && <ViewRoute routeId={selectedRoute._id} />}
        </div>
      </div>
    </>
  );
};

export default ViewRoutes;