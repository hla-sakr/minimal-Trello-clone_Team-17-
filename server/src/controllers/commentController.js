import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Card from "../models/Card.js";

// POST /api/cards/:cardId/comments
export const createComment = async (req, res) => {
  const { cardId } = req.params;
  const text = req.body.text?.trim();

  if (!req.user) { // Check if the user is authenticated
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  if (!mongoose.isValidObjectId(cardId)) {// Check if the cardId is a valid (format of MongoDB ID of obj)
    return res.status(400).json({ success: false, message: "Invalid card id" });
  }
  if (!text) {// Check if the comment text is provided not empty
    return res.status(400).json({ success: false, message: "Comment text is required" });
  }

  const card = await Card.findById(cardId);
  if (!card) {// Check if the card exists
    return res.status(404).json({ success: false, message: "Card not found" });
  }

  const comment = await Comment.create({// Create a new comment document in the database
    card: card._id,
    board: card.board,
    author: req.user._id,
    text,
  });

  return res.status(201).json({ success: true, data: comment });
};