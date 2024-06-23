const Vehicle = require('./models/vehicle.js');
const User = require('./models/user.js');
const Trip = require('./models/trip.js');
const sendEmail = require('./sendMail');

const monitorVehicles = async (threshold) => {
    // iterates through all the vehicles and checks if the update time is exceeding the threshold
    // under the specif1ed user
    const currentTime = new Date().getTime();

    const trips = await Trip.find({ tripStatus: { $ne: 'COMPLETED' } }).select('vehicleId userID'); 
    trips.forEach(async (trip) => {
        const vehicle = await Vehicle.findOne({ _id: trip.vehicleId });

        if (currentTime - vehicle.last_location_date_time > threshold) {
            const email = await User.findOne({ googleId: trip.userID }).select('email');
            sendAlert(vehicle, email);
        }
    })
}

sendAlert = async (vehicle, email) => {
    // sends an alert to the user that the vehicle has not been updated for a long time
    await sendEmail(vehicle.userID, vehicle.vehicleID, email.email);
    console.log(`Alert sent to ${email.email} about vehicle ${vehicle.vehicleID}`);
}

module.exports = monitorVehicles;