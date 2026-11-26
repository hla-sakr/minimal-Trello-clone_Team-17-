import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireBoardMember } from "../middleware/boardAccess.js";
import { createLabel, updateLabel, deleteLabel } from "../controllers/cardDetailsController.js";
const router = Router();

// Create a label on a board
router.post("/boards/:boardId/labels", auth, requireBoardMember, createLabel);
//Edit a label
router.put("/boards/:boardId/labels/:labelId", auth, requireBoardMember, updateLabel);
//Delete a label
router.delete("/boards/:boardId/labels/:labelId", auth, requireBoardMember, deleteLabel);
export default router;