//Define the API endpoints and connect them to their corresponding controller functions

import { Router } from "express";
//Imports the controller functions
import { register, login, getMe } from "../controllers/authController.js";
//Imports our authentication middleware
import { auth } from "../middleware/authToken.js";
//Imports the rate limiter middleware for login attempts
import { loginLimiter } from "../middleware/rateLimiter.js"; //Imports the rate limiter middleware for login attempts

//Creates a new Express router instance
const router = Router();

//When a POST request reaches /register, execute the register controller.
router.post("/register", register);

//When a POST request reaches /login, execute the login controller.
router.post("/login", loginLimiter, login);

//When a GET request reaches /me
//execute the auth middleware first, then the getMe controller
router.get("/me", auth, getMe);

export default router;