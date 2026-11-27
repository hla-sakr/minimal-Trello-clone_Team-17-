
import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    //name of the list
    title: {
      type: String,
      required: true,
      trim: true,
    },

    //tarteb list 3la 7asab el position fe el board
    position: {
      type: Number,
      required: true,
    },


  },
 
);

const List = mongoose.model("List", listSchema);

export default List;
