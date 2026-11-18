import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,// 15 minutes
    limit: 10,// 10 tries per IP
    skipSuccessfulRequests: true, // only failed logins count
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Try again in 15 minutes." },
});