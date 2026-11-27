//Member(2) - Hla 
//Define the board endpoints and connect them to their controller functions
import { Router } from "express"; //allows us to create separate route groups
import { auth } from "../middleware/auth.js";
import { requireBoardMember, requireBoardOwner } from "../middleware/boardAccess.js";
import {
  createBoard, getBoards, getBoard, updateBoard,
  deleteBoard, addMember, removeMember,
} from "../controllers/boardController.js";

//Create a new router instance to define the board routes
const router = Router();

//Full endpoint: POST /api/boards, the request passes through auth, createBoard
router.post("/", auth, createBoard);

//THE SAME FOR ALL
router.get("/", auth, getBoards);
router.get("/:id", auth, requireBoardMember, getBoard);
router.put("/:id", auth, requireBoardMember, updateBoard);
router.delete("/:id", auth, requireBoardMember, requireBoardOwner, deleteBoard);
router.post("/:id/members", auth, requireBoardMember, requireBoardOwner, addMember);
router.delete("/:id/members/:userId", auth, requireBoardMember, requireBoardOwner, removeMember);

export default router; //Exports the router so that app.js can use it