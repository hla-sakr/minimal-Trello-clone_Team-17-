/*Start the backend server and connect it to the database*/

import "dotenv/config";//Loads the variables from the .env file into: process.env
import http from "http";//Imports Node.js's built-in HTTP module
import app from "./app.js";//Imports the Express application we configured in app.js
import connectDB from "./config/db.js";//Imports the function that connects to MongoDB

const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // we need this for Socket.IO later

//Calls the database connection function
await connectDB();

//server.listen(): Starts listening for incoming requests
server.listen(PORT, () => console.log(`Server on port ${PORT}`));