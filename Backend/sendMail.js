const nodemailer = require("nodemailer");

const AlertMessage = (vehicleID, receiverEmail) => {
    console.log(receiverEmail);
    return {

    }
}



const sendEmail = async (userID, vehicleID, email) => {
    
    console.log("receiver email: " + email);
    
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

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