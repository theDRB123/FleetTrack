const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    userID: String,
    driverID: String,
    name: String,
    mobileNumber: String,
    info: String,
    password: String,
});

module.exports = mongoose.model('Driver', driverSchema);