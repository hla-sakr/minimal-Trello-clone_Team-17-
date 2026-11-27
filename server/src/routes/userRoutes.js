/*Define the API endpoint of user updates
 and connect them to their corresponding controller functions*/

import { Router } from "express";
import { auth } from "../middleware/authToken.js";
import { updateMe } from "../controllers/userController.js";

const router = Router();

// auth runs first: no valid token, no access
router.put("/me", auth, updateMe);

export default router;