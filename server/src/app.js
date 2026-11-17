import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: "API is running" });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
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