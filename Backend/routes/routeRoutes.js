const express = require('express');
const Route = require('../models/route');
const interpolate = require('../interpolate');
const checkAuthentication = require('../middleware/checkAuthentication');
const router = express.Router();

router.post('/addRoute', checkAuthentication, async (req, res) => {
    const data = req.body;
    const route = new Route({
        userID: req.user.googleId,
        name: data.name,
        distance: data.distance,
        estimatedTime: data.estimatedTime,
        coords: interpolate(data.coords)
    });

    try {
        await route.save();
        console.log("savedRouteData");
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/deleteRoute', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        await Route.deleteOne({ userID: req.user.googleId, _id: data.routeId });
        console.log("deletedRouteData");
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/routenames', checkAuthentication, async (req, res) => {
    console.log("Routes requested");

    try {
        const routes = await Route.find({ userID: req.user.googleId }).select('name distance estimatedTime _id');
        res.send(routes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/routedata/:routeId', checkAuthentication, async (req, res) => {
    console.log("Route data requested");

    try {
        const route = await Route.findOne({ userID: req.user.googleId, _id: req.params.routeId });
        if (!route) return res.status(404).send('Route not found');
        res.send(route);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;