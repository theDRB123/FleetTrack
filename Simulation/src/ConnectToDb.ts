import * as mongoDB from 'mongodb';
import dotenv from 'dotenv'

export async function connectToDb() {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_URL || "");
    const db = client.db("FleetTrack");
    console.log("Connected to database")
    return db;    
}