import './AddRoute.css';
import React, { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

const loadScript = () => {
  let script = document.createElement("script");
  script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=loadMapModule&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l`);
  document.body.appendChild(script);
}


const AddRoute = () => {

  useEffect(() => {
    loadScript()
  }, []);

  const [map, setMap] = useState(null);
  let directionsManager;
  const [routePointsArray, setRoutePointsArray] = useState([[0, 0]]);
  const [routeSelected, setRouteSelected] = useState(false);
  const [routeEstimatedTime, setRouteEstimatedTime] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);

  console.log("Calling function...")
  window.loadMapModule = async () => {
    GetMap();
  }

  const GetMap = () => {
    console.log("Function used...")
    let _map = new window.Microsoft.Maps.Map('#myMap', {});
    setMap(_map)
    // Load the directions module.
    window.Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
      //Create an instance of the directions manager.
      directionsManager = new window.Microsoft.Maps.Directions.DirectionsManager(_map);

      //Specify where to display the route instructions.
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      //Specify the where to display the input panel
      directionsManager.showInputPanel('directionsPanel');

      // Add event handler for directions updated event.
      window.Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) {
        const routePath = e.route[0].routePath;
        console.log("Route path")
        console.log(e.route[0].routePath)
        const time = e.route[0].routeLegs[0].summary.time;
        setRouteEstimatedTime(time);
        console.log("Estimated time")
        console.log(time)
        const distance = e.route[0].routeLegs[0].summary.distance;
        setRouteDistance(distance);
        console.log("Distance")
        console.log(distance)
        /* console.log("Route 0")
        console.log(e.route[0]) */
        const routePoints = [];
        for (var i = 0; i < routePath.length; i++) {
          routePoints.push([routePath[i].latitude, routePath[i].longitude]);
        }
        setRoutePointsArray(routePoints);
        if (routePoints.length > 0) {
          setRouteSelected(true);
          console.log("Route selected")
        }
        console.log(e.route[0])
      });
    });
  }

  const SaveRoutePoints = async () => {
    try {
      const startingPoint = await getName(routePointsArray[0][0], routePointsArray[0][1]);
      const endingPoint = await getName(routePointsArray[routePointsArray.length - 1][0], routePointsArray[routePointsArray.length - 1][1]);

      console.log("Starting point and ending point")
      console.log(startingPoint)
      console.log(endingPoint)

      const data = {
        "name": startingPoint.city + "_" + startingPoint.state + "_" + startingPoint.zipCode + "_to_" + endingPoint.city + "_" + endingPoint.state + "_" + endingPoint.zipCode,
        "coords": routePointsArray,
        "estimatedTime": routeEstimatedTime,
        "distance": routeDistance
      }

      console.log(routePointsArray)

      const response = await fetch(`${apiUrl}/addRoute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const responseData = await response.json();
      console.log(responseData);
      alert("Route points saved successfully");
      //redirect to dashboard
      window.location.href = "/ViewRoutes";

    } catch (error) {
      console.error(error);
    }
  }

  const getNamePromise = async (latitude, longitude) => {
    let searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
    let requestOptions = {
      location: new window.Microsoft.Maps.Location(latitude, longitude)
    };

    return new Promise((resolve, reject) => {
      <style color='black'></style>
      requestOptions.callback = function (answer, userData) {
        let city = answer.address.locality;
        let state = answer.address.adminDistrict;
        let zipCode = answer.address.postalCode;
        resolve({ city, state, zipCode });
      };
      requestOptions.errorCallback = function (e) {
        reject(e);
      };
      searchManager.reverseGeocode(requestOptions);
    });
  };

  const getName = async (latitude, longitude) => {
    const loc = await getNamePromise(latitude, longitude).then(location => {
      return location
    }).catch(error => console.log(error));
    return loc
  }

  return (
    <>
      <div className="container">
        <div className="directionsContainer">
          <div id="directionsPanel"></div>
          <div id="directionsItinerary"></div>
        </div>
        <div className='map'>
          <div id="myMap">
          </div>
        </div>
      </div>
      {routeSelected && <button id="saveButton" onClick={SaveRoutePoints}>Save Route Points</button>}
    </>
  );
};

export default AddRoute;