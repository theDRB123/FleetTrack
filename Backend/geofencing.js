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

const minimumDistanceInKm = async (position, lastIndex, routeData, threshold) => {
    // get the minimum distance from -10 to +10 of last index, in kilometers
    let minDistance = 1000000;
    let min_Distance_Index = -1;

    for (let i = -10; i <= 10; i++) {
        if (lastIndex + i < 0 || lastIndex + i >= routeData.length) {
            continue;
        }
        let distance = getDistanceFromLatLonInKm(position.lat, position.lng, routeData[lastIndex + i][0], routeData[lastIndex + i][1]);
        if (distance < minDistance) {
            minDistance = distance;
            min_Distance_Index = lastIndex + i;
        }
    }
    if (minDistance < threshold) {
        return [true, min_Distance_Index];
    }
    //otherwise iterate for all the points
    for (let i = 0; i < routeData.length; i++) {

        let distance = getDistanceFromLatLonInKm(position[0], position[1], routeData[i][0], routeData[i][1]);
        if (distance < minDistance) {
            minDistance = distance;
            min_Distance_Index = i;
        }
    }

    if(minDistance < threshold) {
        return [true, min_Distance_Index];
    } else {
        return [false, min_Distance_Index];
    }
}


const convertToCartesian = (lat, long) => {
    const x = Math.cos(lat) * Math.cos(long);
    const y = Math.cos(lat) * Math.sin(long);
    const z = Math.sin(lat);
    return { x, y, z };
}

module.exports = minimumDistanceInKm;