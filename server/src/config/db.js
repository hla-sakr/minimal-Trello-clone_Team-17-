/*Connect our backend application to MongoDB.*/

import mongoose from "mongoose";

//Connecting to a database requires communicating with another process or server.
//Instead of blocking the entire application while waiting, JavaScript can continue handling other work.
//async and await to handle these operations.
export default async function connectDB() {
    try {
        //MONGO_URI=mongodb://127.0.0.1:27017/minimal-Trello-clone_Team-17
        /* 
           mongodb://: We are connecting using the MongoDB protocol
           127.0.0.1: The database is running on our own computer (localhost).
           27017: MongoDB's default port
           minimal-Trello-clone_Team-17: The database name
        */
        //await make us Wait until the connection succeeds or fails before moving to the next line
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB error:", err.message);
        process.exit(1); //Terminates the Node.js application, Because our application depends on MongoDB
    }
}