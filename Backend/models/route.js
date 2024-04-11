const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    userID: String,
    name: String,
    distance: Number,
    estimatedTime: Number,
    coords: [[Number]]
});

module.exports = mongoose.model('Route', routeSchema);