const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userID: String,
    tripId: String,
    routeName: String,
    vehicleId: String,
    driverId: String,
    info: String,
    scheduled_date_time: Number,
    trip_start_date_time: Number,
    trip_end_date_time: Number,
    last_route_point_index: Number,
    tripStatus: String
});

module.exports = mongoose.model('Trip', tripSchema);
