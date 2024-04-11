const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const interpolate = require('./interpolate');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
require('dotenv').config();

let Data = require('./data/routeCoords.json');
let TripData = require('./data/tripData.json');


//importing the models
const Route = require('./models/route')
const Trip = require('./models/Trip')
const Driver = require('./models/driver')
const User = require('./models/user')
const Vehicle = require('./models/vehicle')

const connectMongo = async () => {
    console.log("connecting to mongodb")

    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
}

connectMongo();

app.use(cors());
app.use(express.json());

const globalUserID = "test";

app.post('/addRoute', async (req, res) => {
    const data = req.body;

    //TODO Add user validation

    //create a new route
    const route = new Route({
        userID: globalUserID,
        name: data.name,
        distance: data.distance,
        estimatedTime: data.estimatedTime,
        coords: interpolate(data.coords)
    })

    try {
        await route.save();
        console.log("savedRouteData")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

//add driver (name and mobile number) to the driver list
app.post('/addDriver', async (req, res) => {
    const data = req.body;

    //TODO Add user validation

    const driver = new Driver({
        userID: globalUserID,
        name: data.name,
        mobileNumber: data.mobile
    })

    try {
        await driver.save();
        console.log("savedDriverData")
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
});

//add vehicle vehicle_id, max_load to vehicle list
app.post('/addVehicle', async (req, res) => {
    const data = req.body;

    const vehicle = new Vehicle({
        userID: globalUserID,
        vehicleID: data.vehicleID,
        max_load: data.max_load,
        last_location: data.last_location,
        last_location_date_time: data.last_location_data_time
    })

    //TODO check if the same vehicle is already existing

    try {
        await vehicle.save();
        console.log("savedVehicleData")
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
});

//send the list of drivers to the frontend
app.get('/driverData', async (req, res) => {
    console.log("Drivers requested");

    try {
        const drivers = await Driver.find({ userID: globalUserID }).select('name mobileNumber')
        res.send(drivers);
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).send('server error')
    }
});

//send the list of vehicles to the frontend
app.get('/vehicleData', async (req, res) => {
    console.log("Vehicles requested");

    try {
        const vehicles = await Vehicle.find({ userID: globalUserID })
        res.send(vehicles)
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).send('server error')
    }
});

app.post('/updateVehicleLocation', async (req, res) => {
    const data = req.body;
    console.log("updating vehicle location")

    //TODO Validate user before updating the vehicle location

    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            {
                userID: data.userID,
                vehicleID: data.vehicleID
            },
            {
                last_location: data.location,
                last_location_date_time: new Date().toISOString()
            },
            { new: true }
        )

        if (!vehicle) return res.status(404).send('Vehicle not found');

        console.log('Saved!');
        res.send(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//routenames api to send the names of the routes to the frontend
app.get('/routenames', async (req, res) => {
    console.log("Routes requested");

    console.log("Routes requested");

    try {
        const routes = await Route.find().select('name distance estimatedTime');
        res.send(routes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/routedata/:routeName', async (req, res) => {
    console.log("Route data requested");

    try {
        const route = await Route.findOne({ userID: globalUserID, name: req.params.routeName });
        if (!route) return res.status(404).send('Route not found');
        res.send(route);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/tripData', async (req, res) => {
    console.log("Trip data requested");
    try {
        const trips = await Trip.find({ userID: globalUserID });
        res.send(trips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/addTripData', async (req, res) => {
    console.log("Adding Trip Data");
    const data = req.body;

    //TODO same as always, auth first


    const trip = new Trip({
        userID: globalUserID,
        tripId: data.tripId,
        routeName: data.routeName,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        scheduled_date_time: data.scheduled_date_time,
        trip_start_date_time: data.trip_start_date_time,
        trip_end_date_time: data.trip_end_date_time,
        last_route_point_index: data.last_route_point_index,
        tripStatus: data.tripStatus
    });

    // Save the trip document to the database
    try {
        await trip.save();
        console.log('Saved!');
        res.send(trip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



