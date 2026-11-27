
import List from "../models/List.js";

export const createList = async (req, res) => {
  const { title } = req.body;
  const boardId = req.params.boardId;

  const lastList = await List.findOne({ board: boardId })
    .sort({ position: -1 });

  const position = lastList
    ? lastList.position + 65536
    : 65536;

  const list = await List.create({
    board: boardId,
    title,
    position,
  });

  res.status(201).json({
    success: true,
    data: list,
  });
};
