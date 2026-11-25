//Member(2) - Hla 
//Define the structure of a Board document in MongoDB

// with mongoose, it enforce the structure
//of the document to avoid creating a board without 
// a title for example.
import mongoose from "mongoose";

//Destructuring, instead of writing: mongoose.Schema every time
//we extract Schema into a separate variable.
const { Schema } = mongoose;

//Board schema
//title -> string, required, trimmed (Removes whitespace from the beginning and end)
//owner -> reference to a User document, storing its ID that assigned by mongodb, required
//members -> array of references to User documents
//labels -> array of objects with name and color properties
const boardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, //ref: "User" It tells Mongoose that this ObjectId refers to a document belonging to the User model.
    members: [{ type: Schema.Types.ObjectId, ref: "User" }], // owner is also in this list, This field is an array of ObjectIds.
    labels: [{ name: String, color: String }],               // each label gets its own _id, used by member 5
  },
  { timestamps: true } //Add createdAt and updatedAt fields to the schema automatically.
);

boardSchema.index({ members: 1 }); // Faster member queries
boardSchema.index({ title: "text" }); // Enable title search

//creates a Mongoose model called "Board" using the schema we defined
//We export it so other files can use it
export default mongoose.model("Board", boardSchema);