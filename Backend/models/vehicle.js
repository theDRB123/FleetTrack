const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    userID: String,
    vehicleID: String,
    max_load: Number,
    last_location: [Number],
    last_location_date_time: String,
})

module.exports = mongoose.model('Vehicle', vehicleSchema);