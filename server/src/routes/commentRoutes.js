import { Router } from "express";
import { createComment } from "../controllers/commentController.js";

import { auth } from "../middleware/authToken.js";

const router = Router();

// Add a comment to a card
router.post("/cards/:cardId/comments", auth, createComment);

export default router;