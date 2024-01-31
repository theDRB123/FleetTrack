import './AddRoute.css';
import React, { useEffect } from 'react';

const AddRoute = () => {
  var map;
  var directionsManager;
  var routePoints = [];

  (async () => {
    let script = document.createElement("script");
    
    script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=loadMapModule&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l`);
    document.body.appendChild(script);
  })();
  
  window.loadMapModule = function() {
    if (typeof window.Microsoft === 'undefined' || typeof window.Microsoft.Maps === 'undefined') {
      setTimeout(window.loadMapModule, 100); // Retry after 100 ms
      return;
    }
    GetMap();
  }

  function GetMap() {

    console.log("Function used")

    let map = new window.Microsoft.Maps.Map('#myMap', {});

    //Load the directions module.
    window.Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
      //Create an instance of the directions manager.
      let directionsManager = new window.Microsoft.Maps.Directions.DirectionsManager(map);

      //Specify where to display the route instructions.
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      //Specify the where to display the input panel
      directionsManager.showInputPanel('directionsPanel');

      // Add event handler for directions updated event.
      window.Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) {
        var routePath = e.route[0].routePath;
        for (var i = 0; i < routePath.length; i++) {
          routePoints.push([routePath[i].latitude, routePath[i].longitude]);
        }
      });
    });
  }

  function downloadRoutePoints() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(routePoints));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "routePoints.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const getCoordinates = () => {
    const url = "http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=Minneapolis,MN&wp.1=St%20Paul,MN&optmz=distance&routeAttributes=routePath&key={BingMapsKey}"
  }

  return (
    <>
      <div className="directionsContainer">
        <div id="directionsPanel"></div>
        <div id="directionsItinerary"></div>
      </div>
      <div id="myMap">
      </div>
      <button id="downloadButton" onClick={downloadRoutePoints}>Download Route Points</button>
    </>
  );
};

export default AddRoute;
