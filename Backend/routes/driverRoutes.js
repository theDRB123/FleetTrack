
const express = require('express');
const generator = require('generate-password');
const Driver = require('../models/driver');
const Trip = require('../models/trip');
const Vehicle = require('../models/vehicle');
const checkAuthentication = require('../middleware/checkAuthentication');
const router = express.Router();

router.post('/addDriver', checkAuthentication, async (req, res) => {
    console.log("Adding Driver Data");
    const data = req.body;
    const password = generator.generateMultiple(3, {
        length: 6,
        uppercase: true,
        numbers: true,
        lowercase: true
    });

    const driver = new Driver({
        userID: req.user.googleId,
        driverID: data.driverID,
        name: data.name,
        mobileNumber: data.mobile,
        info: data.info,
        password: password[0]
    });

    try {
        await driver.save();
        console.log("saved Driver Data");
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/updateDriver', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        const driver = await Driver.findOneAndUpdate(
            { userID: req.user.googleId, driverID: data.driverID },
            { name: data.name, mobileNumber: data.mobile, info: data.info },
            { new: true }
        );

        if (!driver) return res.status(404).send('Driver not found');
        console.log('Saved!');
        res.send(driver);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/deleteDriver', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        await Driver.deleteOne({ userID: req.user.googleId, driverID: data.driverID });
        console.log("Deleted Driver Data");
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/checkDriver', async (req, res) => {
    const data = req.query;

    try {
        const driver = await Driver.findOne({ driverID: data.driverID, password: data.password });
        if (!driver) return res.send({ isValid: false });
        driver.password = null;
        console.log('Driver found!');
        res.send({ isValid: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/driverData', checkAuthentication, async (req, res) => {
    console.log("Drivers requested");
    try {
        const drivers = await Driver.find({ userID: req.user.googleId }).select('driverID name mobileNumber _id info password');
        res.send(drivers);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

router.post('/updateDriverLocation', async (req, res) => {
    const data = req.body;
    console.log(data);
    
    const driver = await Driver.findOne({ driverID: data.driverID, password: data.password });
    if (!driver) return res.status(401).send('Driver not found');
    
    var curTime = new Date().getTime();
    const vehicleIds = await Trip.find({
        userID: driver.userID,
        driverId: driver._id,
        $or: [
            { tripStatus: { $ne: 'COMPLETED' }, trip_start_date_time: { $lt: curTime + 300000 } },
            { tripStatus: 'RUNNING' }
        ]
    }).distinct('vehicleId');
    
    if (!vehicleIds) return res.status(202).send('No vehicles found');

    curTime = new Date().getTime()
    await Vehicle.updateMany({ _id: { $in: vehicleIds } }, { last_location: data.location, last_location_date_time: curTime });
    res.status(200).send('Location updated');
});

module.exports = router;