const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userID: String,
    tripId: String,
    routeName: String,
    vehicleId: String,
    driverId: String,
    routeId: String,
    info: String,
    scheduled_date_time: Number,
    trip_start_date_time: Number,
    trip_end_date_time: Number,
    last_route_point_index: Number,
    tripStatus: String,
    time_threshold: Number,
    distance_threshold_KM: Number,
    alert_threshold: Number,
});

module.exports = mongoose.model('Trip', tripSchema);
