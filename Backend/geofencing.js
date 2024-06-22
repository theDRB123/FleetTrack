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

const checkCorrectPath = (position, lastIndex, routeData) => {
    // get the minimum distance from -10 to +10 of last index
    let minDistance = 1000000;
    for (i = -10; i < 11; i++) {
        if (lastIndex + i < 0 || lastIndex + i >= routeData.length) {
            continue;
        }
        let distance = getDistanceFromLatLonInKm(position.lat, position.lng, routeData[lastIndex + i].lat, routeData[lastIndex + i].lng);
        if (distance < minDistance) {
            minDistance = distance;
        }
    }
}

const convertToCartesian = (lat, long) => {
    const x = Math.cos(lat) * Math.cos(long);
    const y = Math.cos(lat) * Math.sin(long);
    const z = Math.sin(lat);
    return { x, y, z };
}

