import express from "express";

import {
  createList,
  getLists,
  updateList,
  deleteList,
  moveList
} from "../controllers/listController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create List
router.post("/boards/:boardId/lists", auth, createList);

// Get Lists
router.get("/boards/:boardId/lists", auth, getLists);

// Update List
router.put("/lists/:id", auth, updateList);

// Delete List
router.delete("/lists/:id", auth, deleteList);

// Move List
router.put("/lists/:id/move", auth, moveList);

export default router;