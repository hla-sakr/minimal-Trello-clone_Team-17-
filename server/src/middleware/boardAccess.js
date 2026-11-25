//Member(2) - Hla 
/*The access rule: only members can use a board, only the owner can manage it*/

//mongoose: Used here to validate MongoDB IDs.
//Gives us access to the Board model so we can retrieve boards from MongoDB.
import mongoose from "mongoose";
import Board from "../models/Board.js";

//This is a reusable function for creating errors.
function httpError(status, message) {
  const err = new Error(message);
  err.status = status; // the error handler in app.js reads this
  return err;
}

// Reusable check. Members 3-6 call this directly when their route has a
// list/card id instead of a board id (they load the list/card, read its board, then call this).
//This function checks whether a user is a member of a specific board.
//Step 1: Validate the board ID, Step 2: Find the board
//Step 3: Check if the board exists, Step 4: Check membership
//Step 5: Return the board, If all checks pass, the function returns the board.
export async function getBoardForMember(boardId, userId) {
  if (!mongoose.isValidObjectId(boardId)) throw httpError(400, "Invalid board id");
  const board = await Board.findById(boardId);
  if (!board) throw httpError(404, "Board not found");
  const isMember = board.members.some((m) => m.equals(userId));
  if (!isMember) throw httpError(403, "You are not a member of this board");
  return board;
}

// Runs after auth. Works for /boards/:id/... and /boards/:boardId/...
// Used to make sure the current user belongs to the board.
// useful for routes that don't need the owner, just a member.
export async function requireBoardMember(req, res, next) {
  const boardId = req.params.boardId || req.params.id;
  req.board = await getBoardForMember(boardId, req.user._id);
  next(); //if the user is a member, we can continue to the next middleware or route handler
}

// Runs after requireBoardMember (it needs req.board)
// This middleware checks whether the current user is the board owner.
export function requireBoardOwner(req, res, next) {
  if (!req.board.owner.equals(req.user._id)) {
    throw httpError(403, "Only the board owner can do this");
  }
  next();
}

//getBoardForMember --> performs the actual membership check --> Verifies the user's identity.
//requireBoardMember --> applies that check to routes --> Verifies board membership.
//requireBoardOwner --> adds the extra owner-only restriction --> Verifies board ownership.