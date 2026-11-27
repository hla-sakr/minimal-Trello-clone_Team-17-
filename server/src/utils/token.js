// Token (JWT): a signed “ID card” string. 
// The frontend sends it with every later request,
// so the server knows who is asking without a password each time.

import jwt from "jsonwebtoken";

export default function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// -> later:
// const data = jwt.verify(token, process.env.JWT_SECRET); // → { id: "abc123", ... }

// sign creates the token.
// verify checks it wasn’t changed and hasn’t expired. If it fails, it throws an error.