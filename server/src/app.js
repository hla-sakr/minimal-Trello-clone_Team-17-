/*Configure the Express application and connect all the routes and middleware*/

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//Creates an Express application instance
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

//express.json() parses the incoming JSON 
//and makes the result available as a JavaScript object
app.use(express.json());

//a simple GET endpoint to check whether the backend is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true, data: "API is running"
  });
});

//this means every route defined inside authRoutes.js starts with /api/auth
app.use("/api/auth", authRoutes);
//this means every route defined inside userRoutes.js starts with /api/users
app.use("/api/users", userRoutes);

//404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "URL not found" });
});

// Error handler (keeps the { success, message } format)
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.code === 11000) { //duplicate key (e.g. email)
    status = 400;
    message = "Email already exists";
  } 
  else if (err.name === "ValidationError") {   //Mongoose rules broken
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } 
  else if (err.name === "CastError") {    //bad id like /boards/123
    status = 400;
    message = "Invalid id";
  }

  if (status === 500) {
    console.error(err);  // log the real error for you
    message = "Server error";  //but don't leak details to users
  }
  res.status(status).json({ success: false, message });
});

export default app;