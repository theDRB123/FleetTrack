const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    userID: String,
    name: String,
    mobileNumber: String,
    info: String
});

module.exports = mongoose.model('Driver', driverSchema);