const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const interpolate = require('./interpolate');
const app = express();
const port = 4000;
const session = require('express-session');
const passport = require('passport');
var generator = require('generate-password');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./models/userSchema");
require('dotenv').config();
const monitorVehicles = require('./monitorVehicles');

/* let Data = require('./data/routeCoords.json');
let TripData = require('./data/tripData.json'); */

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;


//importing the models
const Route = require('./models/route')
const Trip = require('./models/trip')
const Driver = require('./models/driver')
const User = require('./models/user')
const Vehicle = require('./models/vehicle')


//routes
const authRoutes = require('./routes/authRoutes');
const routeRoutes = require('./routes/routeRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tripRoutes = require('./routes/tripRoutes');
const appUrl = process.env.APP_URL;
//middleware
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        console.log(origin);
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));



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


app.use(express.json());

//setup session
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
        callbackURL: `${appUrl}/auth/google/callback`,
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try {
                let user = await userdb.findOne({ googleId: profile.id });

                if (user) {
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

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
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

app.use(authRoutes);
app.use(routeRoutes);
app.use(driverRoutes);
app.use(vehicleRoutes);
app.use(tripRoutes);


const MONITOR_INTERVAL = 10000; // 10 seconds
const THRESHOLD = 10000; // 10 seconds

setInterval(() => {
    monitorVehicles(THRESHOLD);
}, MONITOR_INTERVAL);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
