import './AddRoute.css';
import  coordData from './data/routeCoods.json';
import React, { useEffect , useState} from 'react';

const AddRoute = () => {
  var map;
  var directionsManager;
  var routePoints = [];
  const [routeSelected , setRouteSelected] = useState(false);

  (async () => {
    let script = document.createElement("script");
    script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=loadMapModule&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l`);
    document.body.appendChild(script);
  })();

  window.loadMapModule = async () => {
    GetMap();
  }
  const GetMap = () => {
    console.log("Function used...")

    if (!window.Microsoft) {
      console.log("Microsoft is undefined")
    }
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
        for (var i = 0; i < routePath.length; i++) {
          routePoints.push([routePath[i].latitude, routePath[i].longitude]);
        }
        setRouteSelected(true);
      });
    });
  }


  // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(routePoints));
    // var downloadAnchorNode = document.createElement('a');
    // downloadAnchorNode.setAttribute("href", dataStr);
    // downloadAnchorNode.setAttribute("download", "routePoints.json");
    // document.body.appendChild(downloadAnchorNode); // required for firefox
    // downloadAnchorNode.click();
    // downloadAnchorNode.remove();
  function SaveRoutePoints() {
    coordData.push(routePoints);
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
      {routeSelected && <button id="SaveButton" onClick={SaveRoutePoints}>Download Route Points</button>}
      
    </>
  );
};

export default AddRoute;
