//Member 5 sarah

//Creates a new label inside a board
export async function createLabel(req, res) {
    const { name, color } = req.body || {};

    //checks if the name or the color is missing
    if (!name || !color) {
        return res
            .status(400)
            .json({ success: false, message: "name and color are required" });
    }

    //adds the label to the board and saves it
    const board = req.board;
    board.labels.push({ name, color });
    await board.save();

    res.json({ success: true, data: board });
}


//Edits the name or the color of a label 
export async function updateLabel(req, res) {
    const { name, color } = req.body || {};
    const board = req.board;

    //finds the label inside the board using its id from the URL
    const label = board.labels.id(req.params.labelId);
    if (!label) {
        return res
            .status(404)
            .json({ success: false, message: "Label not found" });
    }

    //changes only the fields that were sent
    if (name) label.name = name;
    if (color) label.color = color;
    await board.save();

    res.json({ success: true, data: board });
}

//Deletes a label from a board
export async function deleteLabel(req, res) {
    const board = req.board;

    //makes sure the label exists before deleting it
    const label = board.labels.id(req.params.labelId);
    if (!label) {
        return res
            .status(404)
            .json({ success: false, message: "Label not found" });
    }

    //removes the label from the board and saves
    board.labels.pull(req.params.labelId);
    await board.save();

    //TODO: when Card.js is merged, also remove this label from every card

    res.json({ success: true, data: board });
}