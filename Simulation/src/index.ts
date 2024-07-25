import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import axios, { AxiosResponse } from "axios-typescript";
import axios, { AxiosResponse } from "axios";
import { connectToDb } from "./ConnectToDb";
import { Db, ObjectId } from "mongodb";
dotenv.config();

const username = "Mukesh512";
const password = "h7MOLv";

let db: Db;
let coords: Array<Array<Number>>;
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

loadCoords();

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateVehiclePos(lat: Number, lng: Number) {
    const result = await db.collection("vehicles").updateOne({ _id: new ObjectId(vehicleId) }, { last_location: [lat, lng] })
}
async function simulateVehicle() { 
    //iterate through the coords and update the vehicle position
    for (let i = 0; i < coords.length; i++){
        await updateVehiclePos(coords[i][0], coords[i][1]);
        console.log("updated");
        await delay(10000);
    }
    console.log("Trip completed")
}


