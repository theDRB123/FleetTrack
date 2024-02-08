
const express = require('express');
const cors = require('cors');
const interpolate = require('./interpolate');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

let Data = require('./data/routeCoords.json');
let InterData = require('./data/interpolatedRouteCoords.json');
let TripData = require('./data/tripData.json');

app.use(cors());
app.use(express.json());

app.post('/addRoute', (req, res) => {
    const data = req.body;
    console.log(data)
    Data.routeData.push(data);

    let interpolatedCoords = interpolate(data.coords);
    data.coords = interpolatedCoords;
    InterData.routeData.push(data);

    let formattedData = JSON.stringify(Data, null, 2);

    // Remove newline characters and extra spaces in arrays
    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/routeCoords.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    formattedData = JSON.stringify(InterData, null, 2);
    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/interpolatedRouteCoords.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.send(data);
    res.end();
});

//add driver (name and mobile number) to the driver list
app.post('/addDriver', (req, res) => {
    const data = req.body;
    console.log(data)
    Data.driverData.push(data);

    let formattedData = JSON.stringify(Data, null, 2);

    // Remove newline characters and extra spaces in arrays
    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/routeCoords.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.send(data);
    res.end();
});

//add vehicle vehicle_id, max_load to vehicle list
app.post('/addVehicle', (req, res) => {
    const data = req.body;
    //check if the vehicle_id already exists
    const vehicleExists = Data.vehicleData.some(vehicle => vehicle.vehicle_id === data.vehicle_id);
    if (vehicleExists) {
        res.status(400).send('Vehicle already exists');
        return;
    }
    console.log(data)
    Data.vehicleData.push(data);

    let formattedData = JSON.stringify(Data, null, 2);

    // Remove newline characters and extra spaces in arrays
    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/routeCoords.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.send(data);
    res.end();
});

//send the list of drivers to the frontend
app.get('/driverData', (req, res) => {
    console.log("Drivers requested");
    let drivers = [];

    // Read and parse the JSON file
    const dataPath = path.join(__dirname, 'data', 'routeCoords.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    data.driverData.forEach(driver => {
        const { name, mobile } = driver;
        drivers.push({ name, mobile });
    });

    res.send(drivers);
});

//send the list of vehicles to the frontend
app.get('/vehicleData', (req, res) => {
    console.log("Vehicles requested");
    let vehicles = [];

    // Read and parse the JSON file
    const dataPath = path.join(__dirname, 'data', 'routeCoords.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    data.vehicleData.forEach(vehicle => {
        const { vehicle_id, max_load, last_location, last_location_date_time } = vehicle;
        vehicles.push({ vehicle_id, max_load, last_location, last_location_date_time });
    });

    res.send(vehicles);
});

app.post('/updateVehicleLocation', (req, res) => {
    const data = req.body;
    console.log(data)
    Data.vehicleData.forEach(vehicle => {
        if(vehicle.vehicle_id === data.vehicle_id) {
            vehicle.last_location = data.location;
            vehicle.last_location_date_time = new Date().toISOString();
        }
    });

    let formattedData = JSON.stringify(Data, null, 2);

    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/routeCoords.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.send(data);
    res.end();
});

//routenames api to send the names of the routes to the frontend
app.get('/routenames', (req, res) => {
    console.log("Routes requested");
    let routes = [];

    // Read and parse the JSON file
    // const dataPath = path.join(__dirname, 'data', 'routeCoords.json');
    const dataPath = path.join(__dirname, 'data', 'routeCoords.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    data.routeData.forEach(route => {
        const { name, distance, estimatedTime } = route;
        routes.push({ name, distance, estimatedTime });
    });

    res.send(routes);
});

app.get('/routedata/:routeName', (req, res) => {
    console.log("Route data requested");

    // Read and parse the JSON file asynchronously
    const dataPath = path.join(__dirname, 'data', 'routeCoords.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading route data file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const route = jsonData.routeData.find(route => route.name === req.params.routeName);

            if (route) {
                //console.log(route.coords);
                res.send(route);
            } else {
                console.log('Route not found');
                res.status(404).send('Route not found');
            }
        } catch (parseError) {
            console.error('Error parsing route data:', parseError);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/tripData', (req, res) => {
    console.log("Trip data requested");
    const dataPath = path.join(__dirname, 'data', 'tripData.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if(err) {
            console.log('Error reading trip data file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const trips = jsonData.tripData;
            if(trips) {
                res.send(trips);
            } else {
                console.log('Trip data not found');
                res.status(404).send('Trip data not found');
            }
        } catch (parseError) {
            console.error('Error parsing trip data:', parseError);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



//route format
// {"name":"route1","coords":[]
//     },
