const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    password: String,
    phoneNumber: String,
    email: String,
});

module.exports = mongoose.model('User', userSchema);