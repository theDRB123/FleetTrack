module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log("User not authenticated");
        res.status(401).send("User not authenticated");
    }
};
