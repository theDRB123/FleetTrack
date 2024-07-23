
const express = require('express');
const Trip = require('../models/trip'); 
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
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
        info: data.info,
        scheduled_date_time: data.scheduled_date_time,
        trip_start_date_time: data.trip_start_date_time,
        trip_end_date_time: data.trip_end_date_time,
        last_route_point_index: data.last_route_point_index,
        tripStatus: data.tripStatus
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

router.get('/getDriverTrips', async (req, res) => {
    console.log("Getting Driver Trips");
    const data = req.query;
    const driver = await Driver.findOne({ driverID: data.driverID, password: data.password });
    const userID = driver.userID;

    try {
        const trips = await Trip.find({ userID: userID, driverId: driver._id });
        res.send(trips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;