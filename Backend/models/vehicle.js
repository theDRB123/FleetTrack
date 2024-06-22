const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    userID: String,
    vehicleID: String,
    max_load: Number,
    info: String,
    password: String,
    last_location: [Number],
    last_location_date_time: Number,
})

module.exports = mongoose.model('Vehicle', vehicleSchema);