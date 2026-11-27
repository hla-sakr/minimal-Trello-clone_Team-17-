import mongoose from "mongoose";
import Card from "../models/Card.js";//Perform card database operations
import { getBoardForMember } from "../middleware/boardAccess.js";//Check whether the user has permission

const POSITION_GAP = 65536;

// POST /api/lists/:listId/cards
export async function createCard(req, res) {

    //It extracts the list ID and the new card's title
  const { listId } = req.params;
  const { title } = req.body || {};

  // Validate list ID
  if (!mongoose.isObjectIdOrHexString(listId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid list id"
    });
  }

  // Validate card title
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Card title is required"
    });
  }

  //not implemented yet so i made it manually <lesa hattzbt>
  // Retrieve the registered List model
  const List = mongoose.model("List");

  // Find the list
  const list = await List.findById(listId);

  if (!list) {
    return res.status(404).json({
      success: false,
      message: "List not found"
    });
  }

  // Check board membership
  //from member 2 boardAccess.js
  await getBoardForMember(list.board, req.user._id);

  // Find the last card in the list
  const lastCard = await Card.findOne({
    list: list._id
  }).sort({ position: -1 });//sort descending order to return last iteam in the list to get its position 

  // Calculate the new card position
  const position = lastCard
    ? lastCard.position + POSITION_GAP
    : POSITION_GAP;

  // Create the card
  const card = await Card.create({
    board: list.board,
    list: list._id,
    title: title.trim(),
    position: position
  });

  // Return the created card
  return res.status(201).json({
    success: true,
    data: card
  });
}
