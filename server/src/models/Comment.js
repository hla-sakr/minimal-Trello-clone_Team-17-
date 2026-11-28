import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    card: { type: Schema.Types.ObjectId, ref: "/not done", required: true, index: true }, //!need to do when card done
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// creates a Mongoose model called "Comment" using the schema above
export default mongoose.model("Comment", commentSchema);