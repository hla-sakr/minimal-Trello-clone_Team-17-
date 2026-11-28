/*Handle the update user operations*/

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cleanUser from "../utils/CleanUser.js";
import { passwordError } from "../utils/Email&Pass_validators.js";

// PUT /api/users/me
export async function updateMe(req, res) {
  const { name, avatar, password, currentPassword } = req.body || {};

  // 1.Reject an empty fileds
  if (name === undefined && avatar === undefined && password === undefined) {
    return res.status(400).json({ success: false, message: "Nothing to update" });
  }

  // 2.Validate each field that was sent
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim() || name.length > 50)
      return res.status(400).json({ success: false, message: "Name is required" });
  }
  if (avatar !== undefined) {
    // "" is allowed: it means "remove my avatar"
    if (typeof avatar !== "string" || avatar.length > 2048)
      return res.status(400).json({ success: false, message: "Invalid avatar" });
  }

  // 3.Load the user WITH the hash (it is hidden by default)
  const user = await User.findById(req.user._id).select("+passwordHash");

  if (password !== undefined) {
    const pwError = passwordError(password);
    if (pwError) return res.status(400).json({ success: false, message: pwError });

    //Must prove they know the old password
    if (typeof currentPassword !== "string" ||
        !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  // 4.Apply the simple fields and save
  if (name !== undefined) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  res.json({ success: true, data: cleanUser(user) });
}