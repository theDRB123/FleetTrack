const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const interpolate = require('./interpolate');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
const session = require('express-session');
const passport = require('passport');
var generator = require('generate-password');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./models/userSchema");
require('dotenv').config();

/* let Data = require('./data/routeCoords.json');
let TripData = require('./data/tripData.json'); */

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;


//importing the models
const Route = require('./models/route')
const Trip = require('./models/Trip')
const Driver = require('./models/driver')
const User = require('./models/user')
const Vehicle = require('./models/vehicle')

const connectMongo = async () => {
    console.log("connecting to mongodb")

    await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
}

connectMongo();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

const globalUserID = "test";


//setuo session
app.use(session({
    secret: "nge46uywse4za578uesdf2q3lbvsjryio56wergxcmgh",
    resave: false,
    saveUninitialized: true
}));


//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: clientid,
        clientSecret: clientsecret,
        callbackURL: "http://localhost:4000/auth/google/callback",
        scope: ["profile", "email"]
    },
    async(accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try{
            let user = await userdb.findOne({googleId: profile.id});

            if(user){
                return done(null, user);
            } else {
                const newUser = new userdb({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });

                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error, null);
        }
    })
);

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        console.log("User not authenticated");
        res.status(401).send("User not authenticated");
    }
}

//serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});


//initialize google auth login
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000"
}));

app.get("/login/sucess", (req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    } else {
        res.status(500).json({
            success: false,
            message: "user failed to authenticate"
        });
    }
});

app.get("/logout", (req, res) => {
    req.logOut(function(err){
        if(err){
            return Next(err)
        }
        res.redirect("http://localhost:3000");
    })
});

//add route
app.post('/addRoute', checkAuthentication, async (req, res) => {
    const data = req.body;

    //create a new route
    const route = new Route({
        userID: req.user.googleId,
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

//delete route
app.post('/deleteRoute', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        await Route.deleteOne({ userID: req.user.googleId, _id: data.routeId});
        console.log("deletedRouteData")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

//add driver data
app.post('/addDriver', checkAuthentication, async (req, res) => {
    const data = req.body;

    const driver = new Driver({
        userID: req.user.googleId,
        name: data.name,
        mobileNumber: data.mobile,
        info: data.info
    })

    try {
        await driver.save();
        console.log("saved Driver Data")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
});

app.post('/updateDriver', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        const driver = await Driver.findOneAndUpdate(
            {
                userID: req.user.googleId,
                _id: data._id
            },
            {
                name: data.name,
                mobileNumber: data.mobile,
                info: data.info
            },
            { new: true }
        )

        if (!driver) return res.status(404).send('Driver not found');

        console.log('Saved!');
        res.send(driver);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//delete driver
app.post('/deleteDriver', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        await Driver.deleteOne({ userID: req.user.googleId, _id: data.driverId});
        console.log("Deleted Driver Data")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

//add vehicle data
app.post('/addVehicle', checkAuthentication, async (req, res) => {
    const data = req.body;

    var password = generator.generateMultiple(3, {
        length: 10,
        uppercase: true,
        numbers: true,
        lowercase: true
    });

    const vehicle = new Vehicle({
        userID: req.user.googleId,
        vehicleID: data.vehicleID,
        max_load: data.max_load,
        info: data.info,
        password: password[0],
        last_location: data.last_location,
        last_location_date_time: data.last_location_data_time
    })

    //TODO check if the same vehicle is already existing

    try {
        await vehicle.save();
        console.log("savedVehicleData")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
});

app.post('/updateVehicle', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            {
                userID: req.user.googleId,
                _id: data._id
            },
            {
                vehicleID: data.vehicleID,
                max_load: data.max_load,
                info: data.info
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

//delete vehicle
app.post('/deleteVehicle', checkAuthentication, async (req, res) => {
    const data = req.body;

    try {
        await Vehicle.deleteOne({ userID: req.user.googleId, _id: data.vehicleId});
        console.log("Deleted Vehicle Data")
        res.send(data)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

//send the list of drivers to the frontend
app.get('/driverData', checkAuthentication, async (req, res) => {
    console.log("Drivers requested");
    try {
        const drivers = await Driver.find({ userID: req.user.googleId }).select('name mobileNumber _id info')
        res.send(drivers);
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).send('server error')
    }
});

//send the list of vehicles to the frontend
app.get('/vehicleData', checkAuthentication, async (req, res) => {
    console.log("Vehicles requested");

    try {
        const vehicles = await Vehicle.find({ userID: req.user.googleId })
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

    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            {
                userID: data.userID,
                vehicleID: data.vehicleID,
                password : data.password
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
app.get('/routenames', checkAuthentication, async (req, res) => {
    console.log("Routes requested");

    try {
        const routes = await Route.find({ userID: req.user.googleId }).select('name distance estimatedTime _id');
        res.send(routes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/routedata/:routeId', checkAuthentication, async (req, res) => {
    console.log("Route data requested");

    try {
        const route = await Route.findOne({ userID: req.user.googleId, _id: req.params.routeId});
        if (!route) return res.status(404).send('Route not found');
        res.send(route);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/tripData', checkAuthentication, async (req, res) => {
    console.log("Trip data requested");
    try {
        const trips = await Trip.find({ userID: req.user.googleId });
        //add driver name
        for (let i = 0; i < trips.length; i++) {
            const driver = await Driver.findOne({ userID: req.user.googleId, _id: trips[i].driverId }).select('name');
            const vehicle = await Vehicle.findOne({ userID: req.user.googleId, _id: trips[i].vehicleId }).select('vehicleID');
            console.log(driver);
            trips[i].driverId = driver.name;
            trips[i].vehicleId = vehicle.vehicleID;
        }
        res.send(trips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/addTripData', checkAuthentication, async (req, res) => {
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