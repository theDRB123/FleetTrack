const nodemailer = require("nodemailer");

// const AlertMessage = (vehicleID, receiverEmail) => {
//     console.log(receiverEmail);
//     return {

//     }
// }

const message_time = (vehicleID, email) => {
    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Fleet Track | Alert",
        text: `Fleet Track Alert for vehicle ${vehicleID}`,
        html: `
    <h1>Alert for vehicle ${vehicleID},</h1>
    <br />
    <br />
    <p>Vehicle ${vehicleID} has not been updated for the set threshold. Please confirm the vehicle's status.</p>
        `
    }
    return message;
}

const message_trip = (vehicleID, email) => {
    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Fleet Track | Alert",
        text: `Fleet Track Alert for vehicle ${vehicleID}`,
        html: `
    <h1>Alert for vehicle ${vehicleID},</h1>
    <br />
    <br />
    <p>Vehicle ${vehicleID} is about to reach the destination, please monitor trip status.</p>
        `
    }
    return message;
}

const message_geofence = (vehicleID, email) => {
    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Fleet Track | Alert",
        text: `Fleet Track Alert for vehicle ${vehicleID}`,
        html: `
    <h1>Alert for vehicle ${vehicleID},</h1>
    <br />
    <br />
    <p>Vehicle ${vehicleID}, Your vehicle has moven out of the geofence threshold.</p>
        `
    }
    return message;
}


const sendEmail = async (userID, vehicleID, email, Type) => {

    console.log("receiver email: " + email);

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let message;
    
    if (Type === "time_alert") {
        message = message_time(vehicleID, email);
    } else if (Type === "trip_alert") {
        message = message_trip(vehicleID, email);
    } else if (Type === "geofence_alert") {
        message = message_geofence(vehicleID, email);
    } else {
        console.log("Invalid alert type");
        return;
    }

    // console.log(message);

    const transporter = nodemailer.createTransport(config);
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log("Error occurred when sending email => " + err.message);
            return err;
        }
        console.log("Message sent via email: %s", info.messageId);
        return info;
    }
    );
    console.log("email sent...");
};

module.exports = sendEmail;