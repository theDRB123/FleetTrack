import React, { useEffect } from 'react';

const AddRoute = () => {
  useEffect(() => {
    const getMap = async () => {
      //const bingKey = "";

      // Dynamically create the Bing Maps script element
      const script = document.createElement("script");
      script.src = "https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l";
      document.body.appendChild(script);
      
      script.onload = () => {
        // Initialize the map after the Bing Maps script is loaded
        const map = new window.Microsoft.Maps.Map('#myMap', {});

        // Load the directions module.
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
          // Create an instance of the directions manager.
          const directionsManager = new window.Microsoft.Maps.Directions.DirectionsManager(map);

          // Specify where to display the route instructions.
          directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

          // Specify where to display the input panel.
          directionsManager.showInputPanel('directionsPanel');
        });
      };
    };

    // Invoke the function to load the map
    getMap();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <div className="directionsContainer">
        <div id="directionsPanel"></div>
        <div id="directionsItinerary"></div>
      </div>
      <div id="myMap"></div>
    </div>
  );
};

export default AddRoute;
