import mongoose from "mongoose";
import Card from "../models/Card.js";//Perform card database operations
import { getBoardForMember } from "../middleware/boardAccess.js";//Check whether the user has permission

const POSITION_GAP = 65536;


//first part 
// Create a new card in a list example using post <POST /api/lists/L1/cards>
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




//second part 
// GET /api/cards/:id
export async function getCard(req, res) {

    //extract the card ID
  const { id } = req.params;

  // Validate card ID,,card ID has the correct format??
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card id"
    });
  }

  // Find the existing card
  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  // Check board membership (ba reuse Member 2's function)
  await getBoardForMember(card.board, req.user._id);

  // Populate assigned members(replacing an ID with the actual information(name email and the avatar) associated with that ID)
  await card.populate("members", "name email avatar");

  // Return the card
  return res.status(200).json({
    success: true,
    data: card
  });
}






//third part
// PUT /api/cards/:id
export async function updateCard(req, res) {

  // extract id ,title , description 
  const { id } = req.params;
  const { title, description } = req.body || {};

  // Validate card ID,,card ID has the correct format??
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card id"
    });
  }

  // Validate title if provided
  if (title !== undefined &&
      (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid card title"
    });
  }

  // Validate description if provided
  if (description !== undefined &&
      typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid card description"
    });
  }

  // Check that at least one field is provided
  if (title === undefined && description === undefined) {
    return res.status(400).json({
      success: false,
      message: "No fields to update"
    });
  }

  // Find the existing card
  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  // Check board membership
  await getBoardForMember(card.board, req.user._id);

  // Update the provided fields
  if (title !== undefined) {
    card.title = title.trim();
  }

  if (description !== undefined) {
    card.description = description;
  }

  // Save changes to MongoDB
  await card.save();

  // Return the updated card
  return res.status(200).json({
    success: true,
    data: card
  });
}








//fourth part 
// DELETE /api/cards/:id
export async function deleteCard(req, res) {

  // Extract the card ID
  const { id } = req.params;

  // Validate card ID
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card id"
    });
  }

  // Find the existing card
  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  // Check board membership
  await getBoardForMember(card.board, req.user._id);

  // Delete the card from MongoDB
  await card.deleteOne();

  // Return the deleted card ID
  return res.status(200).json({
    success: true,
    data: { id: id }
  });
}








// Fifth part
// PUT /api/cards/:id/move
export async function moveCard(req, res) {

  // Extract request information<position is given by the front end and calc part will be later lesa>
  const { id } = req.params;
  const { toListId, position } = req.body || {};

// Check whether another card occupies the requested position
//seach 3la card 3ndha same destination list, w same requested position bas <$ne:> means not equal to the current card's ID
const occupiedPosition = await Card.findOne({
  list: destinationList._id,
  position: position,
  _id: { $ne: card._id }
});

if (occupiedPosition) {
  return res.status(409).json({
    success: false,
    message: "Card position is already occupied"
  });
}


  // Validate card ID
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card id"
    });
  }

  // Validate destination list ID
  if (!mongoose.isObjectIdOrHexString(toListId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid destination list id"
    });
  }

  // Validate position
  //Checks whether the position is an actual number and is not infinite or NaN (Not a Number)
  if (!Number.isFinite(position)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card position"
    });
  }

  // Find the existing card
  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  // Check board membership
  await getBoardForMember(card.board, req.user._id);

  // Retrieve the registered List model<not implemented lesa hattzbt>
  const List = mongoose.model("List");

  // Find the destination list
  const destinationList = await List.findById(toListId);

  // Check if the destination list exists
  if (!destinationList) {
    return res.status(404).json({
      success: false,
      message: "Destination list not found"
    });
  }

  // Check that both belong to the same board
  if (!destinationList.board.equals(card.board)) {
    return res.status(400).json({
      success: false,
      message: "Cannot move card to another board"
    });
  }

  // Update card location and position
  card.list = destinationList._id;
  card.position = position;

  // Save changes to MongoDB
  await card.save();

  // Return the updated card
  return res.status(200).json({
    success: true,
    data: card
  });
}
