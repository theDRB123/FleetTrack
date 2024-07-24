const Vehicle = require('./models/vehicle.js');
const User = require('./models/user.js');
const Trip = require('./models/trip.js');
const Route = require('./models/route.js');
const sendEmail = require('./sendMail');
const minimumDistanceInKm = require('./geofencing.js');


const updateIndex = async (tripId, new_index) => {
    await Trip.findOneAndUpdate(
        { tripId: tripId },
        { last_route_point_index: new_index },
        { new: true }
    );
    console.log('Saved!');
}

const monitorVehicles = async (recentAlerts) => {
    // iterates through all the vehicles and checks if the update time is exceeding the threshold
    // under the specif1ed user
    const currentTime = new Date().getTime();

    const trips = await Trip.find({ tripStatus: { $eq: 'RUNNING' } }).select('vehicleId userID time_threshold distance_threshold_KM alert_threshold routeId last_route_point_index');
    
    
    for(const trip of trips){
        const vehicle = await Vehicle.findOne({ _id: trip.vehicleId });
        const t_threshold = trip.time_threshold;
        const d_threshold = trip.distance_threshold_KM;
        const a_threshold = trip.alert_threshold;
        

        if (recentAlerts.get(vehicle.vehicleID) === undefined) {
            recentAlerts.set(vehicle.vehicleID, currentTime - a_threshold - 1);
            continue;
        }

        //check if the vehicle has already been alerted
        if (currentTime - recentAlerts.get(vehicle.vehicleID) > a_threshold) {
            recentAlerts.set(vehicle.vehicleID, currentTime);

            if (currentTime - vehicle.last_location_date_time > t_threshold) {
                const email = await User.findOne({ googleId: trip.userID }).select('email');
                try {
                    await sendAlert(vehicle, email, "time_alert");
                    recentAlerts.set(vehicle.vehicleID, currentTime);
                } catch (err) {
                    console.error(err);
                    recentAlerts.delete(vehicle.vehicleID);
                }
            }

            const location = vehicle.last_location;
            // console.log("last location: " + location.lat + " " + location.lng);
            const last_index = trip.last_route_point_index;
            let routeData = await Route.findOne({ _id: trip.routeId });
            let [isValid, new_index] = await minimumDistanceInKm(location, last_index, routeData.coords, d_threshold);
            updateIndex(trip.tripId, new_index);

            if (!isValid) {
                const email = await User.findOne({ googleId: trip.userID }).select('email');
                try {
                    await sendAlert(vehicle, email, "geofence_alert");
                    recentAlerts.set(vehicle.vehicleID, currentTime);
                } catch (err) {
                    console.error(err);
                    recentAlerts.delete(vehicle.vehicleID);
                }
            }
            if (new_index >= routeData.coords.length - 5) {
                //vehicle has reached the end of the route
                const email = await User.findOne({ googleId: trip.userID }).select('email');
                try {
                    await sendAlert(vehicle, email, "trip_alert");
                    recentAlerts.set(vehicle.vehicleID, currentTime);
                } catch (err) {
                    console.error(err);
                    recentAlerts.delete(vehicle.vehicleID);
                }
            }
        }
    }
}

const sendAlert = async (vehicle, email, Type) => {
    // sends an alert to the user that the vehicle has not been updated for a long time
    //email disabled for now
    // await sendEmail(vehicle.userID, vehicle.vehicleID, email.email, Type);
    console.log(`Alert sent to ${email.email} about vehicle ${vehicle.vehicleID} | Type -> ${Type}`);
}

module.exports = monitorVehicles;