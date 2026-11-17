/*Configure the Express application and connect all the routes and middleware*/
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

//Creates an Express application instance
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

//express.json() parses the incoming JSON 
//and makes the result available as a JavaScript object.
app.use(express.json());

//a simple GET endpoint to check whether the backend is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true, data: "API is running"
  });
});

//this means every route defined inside authRoutes.js starts with /api/auth
app.use("/api/auth", authRoutes);

//404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "URL not found" });
});

// Error handler (keeps the { success, message } format)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;