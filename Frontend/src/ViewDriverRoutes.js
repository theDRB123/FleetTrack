import React, { useEffect, useState } from "react";
import ViewRoute from "./ViewRoute";

const ViewDriverRoutes = () => {
    //fetch the routeId from url
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get('routeId');
    const [load, setLoad] = useState(false);
    const [location, setLocation] = useState(null);

    const loadScript = () => {
        let script = document.createElement("script");
        script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=loadMapModule&key=AhP_cuxI2i6AcohWfJLGvOobPxKH11eEfo0TeTDqcQ4PvapLEThf_FQ5OaMgAu-l`);
        script.onload = () => {
            console.log("Script loaded successfully");
            setLoad(true);
        };
        script.onerror = () => {
            console.error("Error loading script");
            setLoad(false);
        };
        document.body.appendChild(script);
      }
    loadScript();
    
    useEffect(() => {
        setTimeout(() => {
            setLoad(true);
        }, 1000);
    }, []);
    
  return (
      <div className="viewMapContainer" style={{ width: '100vw', height: '100vh' }}>
        { load && <ViewRoute routeId= { routeId } liveLocation={ true } />}
      </div>
  );
};

export default ViewDriverRoutes;