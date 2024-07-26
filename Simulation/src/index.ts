import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import { connectToDb } from "./ConnectToDb";
import { Db, ObjectId } from "mongodb";
import { randomizeCoordByPercent } from "./Geocalc";
dotenv.config();

const username = "Ramesh9989";
const password = "Y9Ua3r";
const config = {
    interval: 500, //ms
    randomness: 0.05,// 0-100%
    chance: 0.7
}


let db: Db;
let coords: Array<Array<number>>;
let vehicleId: string;



async function loadCoords() {
    db = await connectToDb();
    const driver = await db
        .collection("drivers")
        .findOne({ driverID: username, password: password }, { projection: { _id: 1 } });
    const driverID = driver?._id.toString();

    const trip = await db.collection("trips").findOne({ driverId: driverID }, { projection: { routeId: 1, vehicleId: 1 } });
    const routeID = trip?.routeId;

    const route = await db
        .collection("routes")
        .findOne({ _id: new ObjectId(routeID) });

    coords = route?.coords;
    vehicleId = trip?.vehicleId;
}

async function main() {
    await loadCoords();
    console.log("route loaded, starting simulation");
    await simulateVehicle();
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




async function updateVehiclePos(lat: number, lng: number) {
    lat = randomizeCoordByPercent(lat, config.chance, config.randomness);
    lng = randomizeCoordByPercent(lng, config.chance, config.randomness);

    const result = await db.collection("vehicles").updateOne(
        { _id: new ObjectId(vehicleId) },
        {
            $set: {
                last_location: [lat, lng],
                last_location_date_time: new Date().getTime()
            }
        } // Use $set to update the field
    );
}
async function simulateVehicle() {
    //iterate through the coords and update the vehicle position
    for (let i = 0; i < coords.length; i++) {
        await updateVehiclePos(coords[i][0], coords[i][1]);
        console.log("updated");
        await delay(100);
    }
    console.log("Trip completed")
}


main();