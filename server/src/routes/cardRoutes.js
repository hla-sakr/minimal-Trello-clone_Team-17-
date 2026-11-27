//import router why?how does the backend know which function to execute when a user performs an action? da el router library bt3mlo 
import { Router } from "express";

import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  moveCard
} from "../controllers/cardController.js";

import { auth } from "../middleware/auth.js";

// Create Express router
const router = Router();

// Create a new card
router.post("/lists/:listId/cards", auth, createCard);

// Retrieve an existing card
router.get("/cards/:id", auth, getCard);

// Update card title and description
router.put("/cards/:id", auth, updateCard);

// Delete an existing card
router.delete("/cards/:id", auth, deleteCard);

// Move or reorder a card
router.put("/cards/:id/move", auth, moveCard);

// Export the router(allow another file to import and use our router)
export default router;
