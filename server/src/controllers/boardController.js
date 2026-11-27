//Member(2) - Hla 
/*Logic of every board endpoint*/
import mongoose from "mongoose";
import Board from "../models/Board.js";
import User from "../models/User.js";

//This is a reusable function for sending error responses
const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

//this constant defines the fields we want to populate.
const MEMBER_FIELDS = "name email avatar";

//POST /api/boards
//Its responsibility is to create a new board for the currently logged-in user.
export async function createBoard(req, res) {
  const { title } = req.body;
  if (!title || !title.trim()) return fail(res, 400, "Title is required");

  const board = await Board.create({
    title,
    owner: req.user._id,
    members: [req.user._id], // owner is also a member
  });
  res.status(201).json({ success: true, data: board });
}

// GET /api/boards  (only boards the user belongs to)
//Its responsibility is to retrieve all boards that belong to the currently logged-in user
export async function getBoards(req, res) {
  const boards = await Board.find({ members: req.user._id }).sort({ updatedAt: -1 }); //Sorts the boards based on their last update
  res.json({ success: true, data: boards });
}

// GET /api/boards/:id  (requireBoardMember already loaded req.board)
//Its responsibility is to retrieve the details of one specific board.
export async function getBoard(req, res) {
  const board = await req.board.populate("members", MEMBER_FIELDS);// we use the existing board that founded y middleware
  res.json({ success: true, data: board });
}

// PUT /api/boards/:id
//Its responsibility is to update the board title.
export async function updateBoard(req, res) {
  const { title } = req.body;
  if (!title || !title.trim()) return fail(res, 400, "Title is required");

  req.board.title = title;
  await req.board.save(); // save the updated board to mongodb
  const board = await req.board.populate("members", MEMBER_FIELDS);

  // TODO(socket): emitToBoard(board._id, "board:updated", board);
  res.json({ success: true, data: board });
}

// DELETE /api/boards/:id  (owner only)
//its responsibility is to delete a board and its related data.
// The check for ownership is done in the requireBoardOwner middleware
export async function deleteBoard(req, res) {
  const boardId = req.board._id;
  const db = mongoose.connection; // Give access to mongodb database connection

  // Delete the children. We use the collections directly because the
  // List/Card/Comment models belong to other members and may not exist yet.
  await db.collection("comments").deleteMany({ board: boardId });
  await db.collection("cards").deleteMany({ board: boardId });
  await db.collection("lists").deleteMany({ board: boardId });
  await Board.deleteOne({ _id: boardId }); // Delete the board itself

  res.json({ success: true, data: { id: boardId } });
}

// POST /api/boards/:id/members  (owner only)
//Its responsibility is to add an existing user to a board using their email address.
export async function addMember(req, res) {
  const { email } = req.body;
  if (!email || !email.trim()) return fail(res, 400, "Email is required");

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return fail(res, 404, "User not found");

  // Atomic: only adds if the user is NOT already in members.
  const board = await Board.findOneAndUpdate(
    { _id: req.board._id, members: { $ne: user._id } }, //$ne means not equal.
    { $addToSet: { members: user._id } },
    { new: true }
  );
  if (!board) return fail(res, 400, "User is already a member");

  await board.populate("members", MEMBER_FIELDS);
  // TODO(socket): emitToBoard(board._id, "board:memberAdded", board);
  res.json({ success: true, data: board });
}

// DELETE /api/boards/:id/members/:userId  (owner only)
// Its responsibility is to remove a user from a board.
export async function removeMember(req, res) {
  const { userId } = req.params; // Get the userId from the request parameters (URL)
  if (!mongoose.isValidObjectId(userId)) return fail(res, 400, "Invalid user id");

  if (req.board.owner.equals(userId)) { //Prevent removing the owner
    return fail(res, 400, "The owner cannot be removed from the board");
  }
  const isMember = req.board.members.some((m) => m.equals(userId)); // Check membership
  if (!isMember) return fail(res, 404, "User is not a member of this board");

  const board = await Board.findByIdAndUpdate(
    req.board._id,
    { $pull: { members: userId } }, //$pull removes the specified value from an array
    { new: true }
  );

  // Unassign the removed user from every card on this board
  await mongoose.connection.collection("cards").updateMany( //updateMany(): Updates all matching cards
    { board: board._id },
    { $pull: { members: new mongoose.Types.ObjectId(userId) } }
  );

  await board.populate("members", MEMBER_FIELDS);
  // TODO(socket): emitToBoard(board._id, "board:memberRemoved", board);
  // TODO(socket): kick the removed user's sockets out of the board room
  res.json({ success: true, data: board });
}