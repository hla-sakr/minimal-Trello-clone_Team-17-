
import mongoose from "mongoose";
import List from "../models/List.js";
import Card from "../models/Card.js";
import Comment from "../models/Comment.js";
import { getBoardForMember } from "../middleware/boardAccess.js";


// 1. Create List
export async function createList(req, res) {
  try {
    const { boardId } = req.params; //get id from url
    const { title } = req.body || {}; //get title from body(request from user)

    // check if id is valid objectid
    if (!mongoose.isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board id"
      });
    }

    // check if title is valid
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "List title is required"
      });
    }

    // check if user is member of this board
    const board = await getBoardForMember(boardId, req.user._id);

    // get last list position in this board and add 1 to get new list position
    const lastList = await List.findOne({
      board: boardId
    }).sort({ position: -1 });

    const position = lastList ? lastList.position + 1 : 0;

    // create new list
    const list = await List.create({
      board: board._id,
      title: title.trim(),
      position: position
    });

    return res.status(201).json({
      success: true,
      data: list
    });

    // if error
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}



// 2. Get Lists
export async function getLists(req, res) {
  try {
    const { boardId } = req.params; //get id from url

    // check if id is valid objectid
    if (!mongoose.isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board id"
      });
    }

    // check if user is member of this board
    await getBoardForMember(boardId, req.user._id);

    // get all lists of this board and sort them by position
    const lists = await List.find({
      board: boardId
    }).sort({ position: 1 });

    // get all cards of each list and add them to the list object
    const listsWithCards = [];

    for (const list of lists) {
      const cards = await Card.find({
        list: list._id
      }).sort({ position: 1 });

      const listData = list.toObject();
      listData.cards = cards;

      listsWithCards.push(listData);
    }

    return res.status(200).json({
      success: true,
      data: listsWithCards
    });

    // if error
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}



// 3. Update List
export async function updateList(req, res) {
  try {
    const { id } = req.params; //get id from url
    const { title } = req.body || {}; //get title from body(request from user)

    // check if id is valid objectid
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list id"
      });
    }

    // check if title is valid
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "List title is required"
      });
    }

    // find list by id
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // check if user is member of this board
    await getBoardForMember(list.board, req.user._id);

    // update list title
    list.title = title.trim();

    // save list
    await list.save();

    return res.status(200).json({
      success: true,
      data: list
    });

    // if error
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}



// 4. Delete List
export async function deleteList(req, res) {
  try {
    const { id } = req.params; //get id from url

    // check if id is valid objectid
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list id"
      });
    }

    // find list by id
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // check if user is member of this board
    await getBoardForMember(list.board, req.user._id);

    // get all cards in this list
    const cards = await Card.find({
      list: list._id
    });

    // delete all comments of each card
    for (const card of cards) {
      await Comment.deleteMany({
        card: card._id
      });
    }

    // delete all cards in this list
    await Card.deleteMany({
      list: list._id
    });

    // delete the list
    await List.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "List deleted successfully"
    });

    // if error
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}



// 5. Move List
export async function moveList(req, res) {
  try {
    const { id } = req.params; //get idlist from url
    const { listIds } = req.body || {}; //get new list order from body(request from user)

    // check if id is valid objectid
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list id"
      });
    }

    // check if listIds is a valid array
    if (!Array.isArray(listIds) || listIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid list order"
      });
    }

    // check if all list ids are valid objectids
    for (const listId of listIds) {
      if (!mongoose.isValidObjectId(listId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid list id"
        });
      }
    }

    // find the moved list by id
    const movedList = await List.findById(id);

    if (!movedList) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // check if user is member of this board
    const board = await getBoardForMember(movedList.board, req.user._id);

    // get all lists of this board
    const boardLists = await List.find({
      board: board._id
    });

    // check if the number of lists is correct
    if (listIds.length !== boardLists.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid list order"
      });
    }

    // check if all lists belong to this board
    for (const list of boardLists) {
      if (!listIds.includes(list._id.toString())) {
        return res.status(400).json({
          success: false,
          message: "Invalid list order"
        });
      }
    }

    // update position of each list according to its new index
    for (let i = 0; i < listIds.length; i++) {
      const list = await List.findById(listIds[i]);

      list.position = i;

      await list.save();
    }

    // get all lists after updating their positions
    const updatedLists = await List.find({
      board: board._id
    }).sort({ position: 1 });

    return res.status(200).json({
      success: true,
      data: updatedLists
    });

    // if error
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}
