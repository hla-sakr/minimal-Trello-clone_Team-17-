/*Protect routes by checking whether the requester has a valid JWT token*/
import jwt from "jsonwebtoken";
import User from "../models/User.js";
//Imports the User model because after verifying a token,
//we need to retrieve the user associated with it.

export async function auth(req, res, next) {
  //1.Read the header(header contains the JWT token): "Authorization: Bearer <token>"
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  //header = "Bearer abc123";
  //["Bearer", "abc123"]
  const token = header.split(" ")[1];

  try {
    //2. Check the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //3. Find the user it belongs to
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    //4.Attach the user so later code can use req.user
    req.user = user;

    //5. Call next() allow the request to continue
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}