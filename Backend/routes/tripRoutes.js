
const express = require('express');
const Trip = require('../models/trip'); 
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const Route = require('../models/route');
const checkAuthentication = require('../middleware/checkAuthentication');
const router = express.Router();

router.get('/tripData', checkAuthentication, async (req, res) => {
    console.log("Trip data requested");
    try {
        const trips = await Trip.find({ userID: req.user.googleId });
        for (let i = 0; i < trips.length; i++) {
            const driver = await Driver.findOne({ userID: req.user.googleId, _id: trips[i].driverId }).select('name');
            const vehicle = await Vehicle.findOne({ userID: req.user.googleId, _id: trips[i].vehicleId }).select('vehicleID');
            trips[i].driverId = driver.name;
            trips[i].vehicleId = vehicle.vehicleID;
        }
        res.send(trips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/addTripData', checkAuthentication, async (req, res) => {
    console.log("Adding Trip Data");
    const data = req.body;

    const trip = new Trip({
        userID: req.user.googleId,
        tripId: data.tripId,
        routeName: data.routeName,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        routeId: data.routeId,
        info: data.info,
        scheduled_date_time: data.scheduled_date_time,
        trip_start_date_time: data.trip_start_date_time,
        trip_end_date_time: data.trip_end_date_time,
        last_route_point_index: 0,
        tripStatus: "SCHEDULED",
        time_threshold: data.time_threshold,
        distance_threshold_KM: data.distance_threshold_KM,
        alert_threshold: data.alert_threshold,
    });

    try {
        await trip.save();
        console.log('Saved!');
        res.send(trip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/updateTripStatus', checkAuthentication, async (req, res) => {
    const data = req.body;
    if(!data)
    {
        return res.status(400).send('Invalid data');
    }
    // console.log(data);
    if(data.tripStatus == 'COMPLETED') {
        const trip = await Trip.findOneAndUpdate(
            { userID: req.user.googleId, _id: data.tripId },
            { tripStatus: data.tripStatus, trip_end_date_time: new Date().getTime() },
            { new: true }
        );
        return res.status(200).send('Trip completed');
    }
    else if(data.tripStatus == 'RUNNING') {
        const trip = await Trip.findOneAndUpdate(
            { userID: req.user.googleId, _id: data.tripId },
            { tripStatus: data.tripStatus, trip_start_date_time: new Date().getTime() },
            { new: true }
        );
        return res.status(200).send('Trip started');
    }
    else {
        return res.status(400).send('Invalid trip status');
    }
});

router.get('/getDriverTrips', async (req, res) => {
    console.log("Getting Driver Trips");
    const data = req.query;
    const driver = await Driver.findOne({ driverID: data.driverID, password: data.password });
    if (!driver) {
        return res.status(401).send('Invalid driver');
    };
    const userID = driver.userID;

    try {
        const trips = await Trip.find({ userID: userID, driverId: driver._id }, '_id userID tripId routeName routeId vehicleId scheduled_date_time trip_start_date_time trip_end_date_time last_route_point_index lastRoutePointIndex tripStatus estimatedTime distance');
        const newTrips = [];
        for (let i = 0; i < trips.length; i++) {
            const route = await Route.findOne({ _id: trips[i].routeId });
            if (route) {
                newTrips.push({ ...trips[i]._doc, estimatedTime: route.estimatedTime, distance: route.distance });;
            }
        }

        res.send(newTrips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;