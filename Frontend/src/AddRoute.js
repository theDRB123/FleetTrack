import './AddRoute.css';
import React, { useEffect, useState } from 'react';

const AddRoute = () => {
  var map;
  var directionsManager;
  const [routePointsArray, setRoutePointsArray] = useState([[0, 0]]);
  const [routeSelected, setRouteSelected] = useState(false);
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");


  // (async () => {

  // })()
  console.log("Calling function...")
  window.loadMapModule = async () => {
    GetMap();
  }

  const GetMap = () => {
    console.log("Function used...")
    let map = new window.Microsoft.Maps.Map('#myMap', {});

    //Load the directions module.
    window.Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
      //Create an instance of the directions manager.
      directionsManager = new window.Microsoft.Maps.Directions.DirectionsManager(map);

      //Specify where to display the route instructions.
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      //Specify the where to display the input panel
      directionsManager.showInputPanel('directionsPanel');

      // Add event handler for directions updated event.
      window.Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) {
        const routePath = e.route[0].routePath;
        const routePoints = [];
        for (var i = 0; i < routePath.length; i++) {
          routePoints.push([routePath[i].latitude, routePath[i].longitude]);
        }
        setRoutePointsArray(routePoints);
        if (routePoints.length > 0) {
          // document.getElementById("downloadButton").style.display = "block";
          setRouteSelected(true);
          // setStartingPoint(e.route[0].origin);
          // setEndingPoint(e.route[0].destination);
          console.log("Route selected")
          console.log(e)
        }
      });
    });
  }

  const SaveRoutePoints = () => {
    const data = {
      "name" : startingPoint + " to " + endingPoint,
      "coords" : routePointsArray
    }
    console.log(routePointsArray)
    // console.log(routePoints)
    fetch('http://localhost:4000/addRoute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert("Route points saved successfully");
      });
  }

  const getCoordinates = () => {
    const url = "http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=Minneapolis,MN&wp.1=St%20Paul,MN&optmz=distance&routeAttributes=routePath&key={BingMapsKey}"
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
