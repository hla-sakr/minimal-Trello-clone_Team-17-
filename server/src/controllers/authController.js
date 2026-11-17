/*Handle the actual authentication operations*/

import bcrypt from "bcryptjs";
import User from "../models/User.js"; //Imports the User model we defined in models/User.js
import generateToken from "../utils/token.js";//Imports the function responsible for generating JWT tokens

/**
 * Defines a function that receives a "user" object
 * Our database "user" contains sensitive information,
 * especially the password hash
 * We don't want to send that information to the frontend
 */
function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

/**
 * req contains information sent by the frontend.
 * res is used by the backend to send a response.
 */

//POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;

  //checks if any required field is missing or empty
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password cannot be empty" });
  }

  //checks if the password contains less than 6 characters
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  //checks if the email is already in use
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  //Hashing the password
  const passwordHash = await bcrypt.hash(password, 10);
  //Creating a new user in the database
  const user = await User.create({
    name: name,
    email: email,
    passwordHash: passwordHash
  });

  //Indicates the operation succeeded and returning the user to the frontend
  res.status(201).json({
    success: true,
    data: {
      user: cleanUser(user),
      token: generateToken(user._id)
    },
  });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password cannot be empty" });
  }

  //"+passwordHash" to include the hidden field this one time
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

  //!user -> Did we find a user with this email?
  //!(await bcrypt.compare(password, user.passwordHash)) -> If the user exists, compare the entered password against the stored hash.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    data: {
      user: cleanUser(user),
      token: generateToken(user._id)
    },
  });
}

// GET /api/auth/me
export async function getMe(req, res) {
  res.json({
    success: true,
    data: cleanUser(req.user)
  });
}