const interpolate = (coordinates) => {
    let result = [];
    console.log(coordinates)
    for (i = 0; i < coordinates.length - 1; i++) {
        c1 = coordinates[i]
        c2 = coordinates[i + 1]
        distance = getDistanceFromLatLonInKm(c1[0], c1[1], c2[0], c2[1])
        console.log("distance is ->" + distance);

        if (distance > 0.2) {
            result.push(c1)
            while (distance > 0.1) {
                midPoint = getMidPoint(c1[0], c1[1], c2[0], c2[1])
                result.push(midPoint)
                distance = getDistanceFromLatLonInKm(midPoint[0], midPoint[1], c2[0], c2[1])
                c1 = midPoint
            }
            result.push(c2)
        } else {
            result.push(c1)
        }
    }
    return result;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const r = 6371; // km
    const p = Math.PI / 180;
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                  (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return (2 * r * Math.asin(Math.sqrt(a))).toFixed(6);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function rad2deg(rad) {
    return rad * (180 / Math.PI)
}

function getMidPoint(lat1, lon1, lat2, lon2) {
    dlon = deg2rad(lon2 - lon1);

    lat1 = deg2rad(lat1);
    lon1 = deg2rad(lon1);
    lat2 = deg2rad(lat2);


    Bx = Math.cos(lat2) * Math.cos(dlon);
    By = Math.cos(lat2) * Math.sin(dlon);
    lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    out1 = rad2deg(lat3).toFixed(6)
    out2 = rad2deg(lon3).toFixed(6)
    //convert back to double
    out1 = parseFloat(out1)
    out2 = parseFloat(out2)
    return [out1,out2];
}

module.exports = interpolate;
