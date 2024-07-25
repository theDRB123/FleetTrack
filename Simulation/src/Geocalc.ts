function getMidPoint(lat1: number, lon1: number, lat2: number, lon2: number) {
    let dlon = deg2rad(lon2 - lon1);

    lat1 = deg2rad(lat1);
    lon1 = deg2rad(lon1);
    lat2 = deg2rad(lat2);


    let Bx = Math.cos(lat2) * Math.cos(dlon);
    let By = Math.cos(lat2) * Math.sin(dlon);
    let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    let lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    let out1 = parseFloat(rad2deg(lat3).toFixed(6));
    let out2 = parseFloat(rad2deg(lon3).toFixed(6))
    //convert back to double
    return [out1, out2];
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

function rad2deg(rad: number) {
    return rad * (180 / Math.PI)
}

export function randomizeCoordByPercent(value: number, chance: number, randomness: number) {
    return value + (Math.random() < chance ? 1 : 0) * (value * randomness / 100) * (Math.random() - 0.5);
}